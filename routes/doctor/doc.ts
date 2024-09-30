import { db } from "$lib/db";
import { entry, exercise, patient, users } from "$lib/db/schema";
import { uploadFile } from "$lib/storage/minio";
import { and, asc, desc, eq } from "drizzle-orm";
import { createRouteGroup } from "routes/group";
import { Readable } from "stream";
import { getPatient, saveVideo } from "./doc.service";

export const Doctor = createRouteGroup({

    async register(req, res) {
        const { id, password } = req.body;
        const hashed = await Bun.password.hash(password);
        users.$inferInsert

        // @ts-ignore
        await db.insert(users).values({
            id,
            password: hashed,
            name: id,
            isDoctor: true,
        });

        res.send("Registered")
    },

    async addPatient(req, res) {
        const { age, password, id, totalDays, startDate } = req.body;
        const user = req.user;
        if (!user || !user.isDoctor)
            return res.sendStatus(403);

        const date = new Date(startDate);

        const h = await Bun.password.hash(password);

        await db.insert(users).values({
            id,
            name: id,
            password: h
        });

        await db.insert(patient).values({
            age,
            id,
            totalDays,
            doctorId: user.id,
            startDate: date,
        });

        return res.send("Success")
    },

    async uploadVideo(req, res) {
        const user = req.user;
        if (!user || !user.isDoctor)
            return res.sendStatus(403);

        const { patientId, day, exerciseNo } = req.body;

        const file = req.file;

        if (!file)
            return res.status(400).send("missing file");

        const info = getPatient(user.id, patientId);
        if (!info)
            return res.sendStatus(403);

        const stream = Readable.from(file.buffer);

        await uploadFile(file.originalname, "exercise", stream);

        // @ts-ignore
        await db.insert(exercise).values({
            day,
            videoName: file.originalname,
            exerciseNo: exerciseNo,
            patientId,
            doctorId: user.id,
        })

        res.send("success");
    },

    async getAllPatients(req, res) {
        const user = req.user;
        if (!user || !user.isDoctor)
            return res.sendStatus(403);

        const patients = await db.select().from(patient).where(eq(patient.doctorId, user.id));
        res.json(patients);
    },

    async getPatientData(req, res) {
        const user = req.user;
        const patientId = req.query['patientId'].toString();

        if (!user || !user.isDoctor || !patientId)
            return res.sendStatus(403);

        const info = await getPatient(user.id, patientId);

        if (!info)
            return res.sendStatus(404);

        const entries = await db.select().from(entry).where(eq(entry.patientId, patientId));

        return res.json({ info, entries });
    },

    async savePatientVideoData(req, res) {
        const user = req.user;

        if (!user || !user.isDoctor)
            return res.sendStatus(403);

        const fileMap = new Map<String, Express.Multer.File>();

        if (req.files) {
            (req.files as Express.Multer.File[]).forEach(file => {
                fileMap.set(file.originalname, file);
            });
        }
        // [[string]]

        const info = req.body as {
            day: number,
            patient: string,
            exercises: string[],
        };

        let alreadySaved = await db.select().from(exercise).where(
            and(
                eq(exercise.day, info.day),
                eq(exercise.patientId, info.patient),
                eq(exercise.doctorId, user.id)
            )
        );

        let toSave = info.exercises || [];
        const processed = new Set<string>();

        const matchSqlQuery = (name: string) => and(
            eq(exercise.day, info.day),
            eq(exercise.patientId, info.patient),
            eq(exercise.doctorId, user.id),
            eq(exercise.videoName, name),
        )

        for (let ex of alreadySaved) {
            if (!toSave.includes(ex.videoName)) {
                // remove file.
                await db.delete(exercise).where(
                    matchSqlQuery(ex.videoName)
                ).execute();
                console.log('removed: ', ex.videoName);
            } else {
                // update entry.
                const newIndex = toSave.indexOf(ex.videoName);
                console.log('updating: ', ex.videoName, 'from', ex.exerciseNo, 'to', newIndex);
                await db.update(exercise).set({
                    exerciseNo: newIndex,
                }).where(
                    matchSqlQuery(ex.videoName)
                ).execute();
            }
            processed.add(ex.videoName);
        }

        toSave.forEach((ex, ind) => {
            if (processed.has(ex))
                return;
            const file = fileMap.get(ex);
            console.log('adding new file: ', ex);
            saveVideo(info.day, info.patient, req.user.id, ind, ex, file);
        });

        res.send("success");
    },


    async getVideos(req, res) {
        const user = req.user;
        const patientId = req.query['patientId'].toString();

        if (!user || !user.isDoctor || !patientId)
            return res.sendStatus(403);

        const videos = await db.select().from(exercise).where(
            and(
                eq(exercise.patientId, patientId),
                eq(exercise.doctorId, user.id),
            ),
        ).orderBy(asc(exercise.day), asc(exercise.exerciseNo));

        const days = {};

        videos.forEach(vid => {
            days[vid.day] ??= [];
            days[vid.day].push(vid);
        });

        res.json(days);
    }
});
import { db } from "$lib/db";
import { entry, exercise, patient, users } from "$lib/db/schema";
import { uploadFile } from "$lib/storage/minio";
import { hash } from "bcrypt";
import { and, eq } from "drizzle-orm";
import { createRouteGroup } from "routes/group";
import { Readable } from "stream";
import { getPatient } from "./doc.service";

export const Doctor = createRouteGroup({

    async register(req, res) {
        const { id, password } = req.body;
        const hashed = await hash(password, 10);
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

        const h = await hash(password, 10);

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

    async getVideos(req, res) {
        const user = req.user;
        const patientId = req.query['patientId'].toString();
        const day = req.query['day'].toString();

        if (!user || !user.isDoctor || !patientId || !day)
            return res.sendStatus(403);
        
        const videos = await db.select().from(exercise).where(
            and(
                eq(exercise.patientId, patientId),
                eq(exercise.doctorId, user.id),
                eq(exercise.day, Number(day)),
            )
        );

        res.json(videos);
    }
});
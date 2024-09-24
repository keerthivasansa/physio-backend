import { db } from "$lib/db";
import { entry, exercise, patient } from "$lib/db/schema";
import { getSignedUrl } from "$lib/storage/minio";
import { and, eq } from "drizzle-orm";
import { createRouteGroup } from "routes/group";


const Patient = createRouteGroup({

    // dashboard
    async getDashboard(req, res) {
        const user = req.user;
        if (!user)
            return res.status(401).send("Not logged in");

        const days = await db.select().from(entry).where(eq(entry.patientId, user.id));
        const info = await db.select().from(patient).where(eq(patient.id, user.id)).limit(1);

        const completed = days.length;
        const avg = {};

        const params = days.length ? Object.keys(days[0].parameters) : [];

        for (let p of params)
            avg[p] = 0;

        for (let d of days) {
            for (let p of params)
                    avg[p] += (d.parameters[p] || 0);
        }

        params.forEach(key => {
            avg[key] /= completed;
        });

        return res.json({ completed, avg, info: info[0] });
    },

    // day entry
    async postEntry(req, res) {
        const user = req.user;
        if (!user)
            return res.status(401).send("Not logged in");

        const { parameters, remarks } = req.body;
        const date = new Date();
        const patientId = user.id;

        await db.insert(entry).values({ parameters, remarks, date, patientId });
    },

    // get videos
    async getVideos(req, res) {
        const user = req.user;
        const day = req.query['day'].toString();

        if (!user || !day)
            return res.status(401).send("Invalid request");

        const id = user.id;

        const videos = await db.select().from(exercise).where(
            and(
                eq(exercise.patientId, id),
                eq(exercise.day, Number(day)),
            )
        );

        const urls = await Promise.all(videos.map(vid => getSignedUrl(vid.videoName, "exercise", 1800)));

        res.json(urls);
    }
});

export { Patient };
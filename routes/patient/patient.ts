import { db } from "$lib/db";
import { entry, exercise } from "$lib/db/schema";
import { getSignedUrl } from "$lib/storage/minio";
import { eq } from "drizzle-orm";
import { createRouteGroup } from "routes/group";


const Patient = createRouteGroup({

    // dashboard
    async getDashboard(req, res) {
        const user = req.user;
        if (!user)
            return res.status(401).send("Not logged in");

        const days = await db.select().from(entry).where(eq(entry.patientId, user.id));
        
        const completed = days.length;
        const avg = {};
        
        for (let d of days) {
            Object.keys(d.parameters).forEach(key => {
                avg[key] += d.parameters[key];
            })
        }

        Object.keys(avg).forEach(key => {
            avg[key] /= completed;
        });

        return res.json({ completed, avg });
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
        if (!user)
            return res.status(401).send("Not logged in");
        const id = user.id;

        const videos = await db.select().from(exercise).where(eq(exercise.patientId, id));

        const urls = await Promise.all(videos.map(vid => getSignedUrl(vid.videoUrl, "exercise", 1800)));

        res.json(urls);
    }
});

export { Patient };
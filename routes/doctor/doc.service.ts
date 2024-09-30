import { db } from "$lib/db";
import { exercise, patient } from "$lib/db/schema";
import { uploadFile } from "$lib/storage/minio";
import { and, eq } from "drizzle-orm";
import { Readable } from "stream";


export async function getPatient(docId: string, patientId: string) {

    const infoRes = await db.select().from(patient).where(
        and(
            eq(patient.id, patientId),
            eq(patient.doctorId, docId)
        )
    ).limit(1);

    if (infoRes.length == 0)
        return null;

    return infoRes[0];
}

export async function saveVideo(day: number, patient: string, doctor: string, index: number, name: string, file?: Express.Multer.File) {
    const res = await db.select().from(exercise).where(eq(exercise.videoName, name));
    if (!res.length && file) {
        const stream = Readable.from(file.buffer);
        await uploadFile(name, "exercise", stream);
        await db.insert(exercise).values({
            patientId: patient,
            doctorId: doctor,
            day,
            exerciseNo: index,
            videoName: name,
        });
    } else if (res.length) {
        await db.update(exercise).set({
            exerciseNo: index
        }).where(
            eq(exercise.videoName, name)
        )
    } else
        throw new Error("Sent filename without file and file doesn't already exist");
};

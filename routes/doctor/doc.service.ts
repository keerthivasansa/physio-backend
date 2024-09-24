import { db } from "$lib/db";
import { patient } from "$lib/db/schema";
import { and, eq } from "drizzle-orm";


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
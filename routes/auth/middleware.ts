import { Application } from "express";
import { verify } from "jsonwebtoken"
import { secrets } from "$lib/config";
import { db } from "$lib/db";
import { users } from "$lib/db/schema";
import { eq } from "drizzle-orm";

export function registerAuthMiddleware(app: Application) {
    app.use((req, res, next) => {
        const token = req.headers.authorization?.split(" ")?.[1]
        console.log({ token });
        if (!token)
            return next(null);
        verify(token, secrets.JWT_SECRET!, async (err, payload) => {
            if (payload?.sub) {
                const id = payload.sub.toString();
                console.log({ id });
                const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
                if (!user.length)
                    return next(null);
                req.user = user[0];
            }
            next(null);
        });
    });
}
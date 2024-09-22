import { sign } from "jsonwebtoken";
import { createRouteGroup } from "../group";
import { db } from "$lib/db";
import { users } from "$lib/db/schema";
import { secrets } from "$lib/config";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcrypt";

export const Auth = createRouteGroup({
    login: async (req, res) => {
        const { id, password } = req.body;
        const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
        if (!user.length)
            return res.status(400).send("Invalid credentials");

        let isValid = await compare(password, user[0].password);
        if (!isValid)
            return res.status(400).send("Invalid credentials");

        const token = sign({ sub: id }, secrets.JWT_SECRET!);
        res.send(token);
    },

    signUp: async (req, res) => {
        const { id, password } = req.body;

        const hashed = await hash(password, 10);

        await db.insert(users).values({
            id,
            password: hashed,
            name: "",
        }).$returningId();

        res.send("Success");
    },

    state: async (req, res) => {
        res.send(req.user?.id || "not logged in");
    }
});

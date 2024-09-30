import express from 'express';
import { registerRoutes } from './routes/register';
import { registerAuthMiddleware } from './routes/auth/middleware';
import { db } from '$lib/db';
import { sql } from 'drizzle-orm';

export const app = express();

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.use(express.json());

registerAuthMiddleware(app);
registerRoutes(app);

app.listen(5000, () => console.log("Server started"));

import express from 'express';
import { registerRoutes } from './routes/register';
import { registerAuthMiddleware } from './routes/auth/middleware';

export const app = express();

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method, req.body);
    next(null);
});

registerAuthMiddleware(app);
registerRoutes(app);

app.listen(5000, () => console.log("Server started"));

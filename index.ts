import express from 'express';
import { registerRoutes } from './routes/register';
import { registerAuthMiddleware } from './routes/auth/middleware';

export const app = express();

app.get("/ping", (req, res) => {
    res.send("pong");  
});

app.use(express.json());

registerAuthMiddleware(app);
registerRoutes(app);

app.listen(5000, () => console.log("Server started"));

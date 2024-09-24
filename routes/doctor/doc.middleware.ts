import { Request, Response } from "express";


function checkIfDoctor(req: Request, res: Response, next: Function) {
    const user = req.user;
    if (!user || !user.isDoctor)
        return res.status(403).send("You must be a doctor to access this route");
    next()
}
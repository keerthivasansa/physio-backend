import { Request, Response } from "express";

export type ReqHandler = (req: Request, res: Response) => void;
export type RouteGroup = Record<string, ReqHandler>; 
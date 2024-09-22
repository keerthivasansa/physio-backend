import { Application } from "express";
import { Auth } from "./auth/auth";
import { Storage } from "./storage/store";
import multer from "multer";

export function registerRoutes(app: Application) {

    app.post("/auth/login", Auth.login);
    app.post("/auth/signup", Auth.signUp);
    app.get("/auth/state", Auth.state);

    const memoryEngine = multer.memoryStorage();
    const upload = multer({ storage: memoryEngine });

    app.post("/storage/upload", upload.single('file'), Storage.upload);
    app.get("/storage/url", Storage.getUrl);

    
}


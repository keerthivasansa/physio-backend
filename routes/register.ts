import { Application } from "express";
import { Auth } from "./auth/auth";
import { Storage } from "./storage/store";
import multer from "multer";
import { Patient } from "./patient/patient";

export function registerRoutes(app: Application) {

    // Auth
    app.post("/auth/login", Auth.login);
    app.post("/auth/signup", Auth.signUp);
    app.get("/auth/state", Auth.state);

    const memoryEngine = multer.memoryStorage();
    const upload = multer({ storage: memoryEngine });

    // Storage
    app.post("/storage/upload", upload.single('file'), Storage.upload);
    app.get("/storage/url", Storage.getUrl);

    
    // Patient
    app.get("/patient/dashboard", Patient.getDashboard);
    app.post("/patient/entry", Patient.postEntry);
    app.get("/patient/videos", Patient.getVideos);
    
}


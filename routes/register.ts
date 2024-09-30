import { Application } from "express";
import { Auth } from "./auth/auth";
import { Storage } from "./storage/store";
import multer from "multer";
import { Patient } from "./patient/patient";
import { Doctor } from "./doctor/doc";

export function registerRoutes(app: Application) {

    const memoryEngine = multer.memoryStorage();
    const upload = multer({ storage: memoryEngine });

    // Auth
    app.post("/auth/login", Auth.login);
    app.post("/auth/signup", Auth.signUp);
    app.get("/auth/state", Auth.state);


    // Storage
    app.post("/storage/upload", upload.single('file'), Storage.upload);
    app.get("/storage/url", Storage.getUrl);


    // Patient
    app.get("/patient/dashboard", Patient.getDashboard);
    app.post("/patient/entry", Patient.postEntry);
    app.get("/patient/videos", Patient.getVideos);


    // Doctor
    app.get("/doctor/patients", Doctor.getAllPatients)
    app.get("/doctor/patient", Doctor.getPatientData)
    app.get("/doctor/patient/videos", Doctor.getVideos)
    
    app.post("/doctor/register", Doctor.register)
    app.post("/doctor/add-patient", Doctor.addPatient)
    app.post("/doctor/videos/save", upload.any(), Doctor.savePatientVideoData)
}


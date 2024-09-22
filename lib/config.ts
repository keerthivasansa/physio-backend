import { config } from "dotenv"

config();

export const secrets = {
    JWT_SECRET: process.env.JWT_SECRET,
    DB_URI: process.env.DB_URI,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
};

console.log(secrets);

Object.keys(secrets).forEach((key) => {
    if (!secrets[key])
        throw new Error("Secret missing: " + key);
})


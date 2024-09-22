import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import { secrets } from "$lib/config";
import { migrate } from "drizzle-orm/mysql2/migrator";

const connection = mysql.createConnection({
    uri: secrets.DB_URI
});

export const db = drizzle(connection);

migrate(db, { migrationsFolder: "./drizzle" }).then(() => {
    console.log('Database migrations applied')
});

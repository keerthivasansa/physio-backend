import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import { secrets } from "$lib/config";
import { migrate } from "drizzle-orm/mysql2/migrator";

const connection = mysql.createPool({
    uri: secrets.DB_URI,
    maxIdle: 2,
    connectionLimit: 5,
    idleTimeout: 3600 * 3 * 1000, // 3 hours

});

export const db = drizzle(connection);

migrate(db, { migrationsFolder: "./drizzle" }).then(() => {
    console.log('Database migrations applied')
});

connection.on('error', (err) => {
    console.log(err);
})
import { text, boolean, mysqlTable, varchar, date, json, primaryKey, int } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: varchar("id", { length: 64 }).primaryKey(),
    name: text("name").notNull(),
    password: text("password").notNull(),
    isDoctor: boolean("isDoctor").default(false).notNull()
});

export const patient = mysqlTable("patients", {
    id: varchar("id", { length: 64 }).primaryKey(),
    doctorId: varchar("doctorId", { length: 64 }).notNull(),
    startDate: date("startDate").notNull(),
    totalDays: int("totalDays").notNull(),
    age: int("age").notNull()
});

export const entry = mysqlTable("dayEntry", {
    date: date("date"),
    patientId: varchar("patientId", { length: 64 }),
    parameters: json("params"),
    remarks: text("remarks")
}, (t) => ({
    id: primaryKey({ columns: [t.date, t.patientId] }),
}));

export const exercise = mysqlTable("exercise", {
    videoName: varchar("filename", { length: 256 }).notNull(),
    patientId: varchar("patientId", { length: 64 }).notNull(),
    doctorId: varchar("doctorId", { length: 64 }).notNull(),
    day: int("day").notNull(),
    exerciseNo: int("exerciseNo").notNull(),
}, (t) => ({
    id: primaryKey({ columns: [t.day, t.doctorId, t.patientId, t.videoName] }),
}));

export type User = typeof users.$inferSelect;
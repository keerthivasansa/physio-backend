import { text, boolean, mysqlTable, varchar, date, json, primaryKey } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: varchar("id", { length: 64 }).primaryKey(),
    name: text("name").notNull(),
    password: text("password").notNull(),
    isDoctor: boolean("isDoctor").default(false).notNull()
});

export const patient = mysqlTable("patients", {
    id: varchar("id", { length: 64 }).primaryKey(),
    doctorId: varchar("doctorId", { length: 64 }),
    startDate: date("startDate")
})

export const entry = mysqlTable("dayEntry", {
    date: date("date"),
    patientId: varchar("patientId", { length: 64 }),
    parameters: json("params"),
    remarks: text("remarks")
}, (t) => ({
    id: primaryKey({ columns: [t.date, t.patientId] }),
}))

export const exercise = mysqlTable("exercise", {
    videoUrl: text("url").primaryKey(),
    patientId: varchar("patientId", { length: 64 })
});

export type User = typeof users.$inferSelect;
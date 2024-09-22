import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './lib/db/schema.ts',
    out: './drizzle',
    dialect: 'mysql', // 'postgresql' | 'mysql' | 'sqlite'
    dbCredentials: {
        url: process.env.DB_URI!
    }
});
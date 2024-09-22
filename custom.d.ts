declare global {
    namespace Express {
        export interface Request {
            user?: import("./lib/db/schema").User
        }
    }
}

export { }
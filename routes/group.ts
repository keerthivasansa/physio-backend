import { ReqHandler } from "$lib/types";

export function createRouteGroup<T extends Record<string, ReqHandler>>(obj: T): T {
    return obj;
}
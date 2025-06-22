import type { HonoEnv } from "@/definitions/config.ts";
import { getContext } from "hono/context-storage";

export function setKV(...params: Parameters<KVNamespace["put"]>) {
	return getContext<HonoEnv>().env.KV.put(...params);
}

export async function getKV<T = unknown>(
	key: string,
	type: "json" | "text" = "text",
) {
	return getContext<HonoEnv>().env.KV.get<T>(
		// @ts-ignore
		key,
		type,
	) as Promise<T | null>;
}

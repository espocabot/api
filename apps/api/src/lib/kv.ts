import { getContext } from "hono/context-storage";
import type { HonoEnv } from "./definitions";

export function setKV(...params: Parameters<KVNamespace["put"]>) {
	return getContext<HonoEnv>().env.ESPOCABOT_SPARK_API_CACHE.put(...params);
}

export async function getKV<T = unknown>(
	key: string,
	type: "json" | "text" = "text",
) {
	return getContext<HonoEnv>().env.ESPOCABOT_SPARK_API_CACHE.get<T>(
		// @ts-ignore
		key,
		type,
	) as Promise<T | null>;
}

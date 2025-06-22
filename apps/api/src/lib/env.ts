import type { HonoEnv } from "@/definitions/config.ts";
import { getContext } from "hono/context-storage";

export function getEnvs() {
	return getContext<HonoEnv>().env;
}

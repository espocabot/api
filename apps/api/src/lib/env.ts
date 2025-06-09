import { getContext } from "hono/context-storage";
import type { HonoEnv } from "./definitions";

export function getEnvs() {
	return getContext<HonoEnv>().env;
}

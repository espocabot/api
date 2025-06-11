import { getContext } from "hono/context-storage";
import type { HonoEnv } from "./definitions.ts";

export function getTranslator() {
	return getContext<HonoEnv>().var.t;
}

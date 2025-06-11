import { Hono } from "hono";

import type { HonoEnv } from "@/lib/definitions.ts";

const health = new Hono<HonoEnv>();

health.get("/", async (c) => {
	return c.json(
		{
			status: "ok",
			timestamp: Date.now(),
		},
		200,
	);
});

export { health };

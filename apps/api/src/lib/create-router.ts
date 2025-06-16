import { OpenAPIHono } from "@hono/zod-openapi";
import type { HonoEnv } from "./definitions.ts";
import { UNPROCESSABLE_ENTITY } from "./http/http-status-code.ts";

export function createRouter() {
	return new OpenAPIHono<HonoEnv>({
		strict: true,
		defaultHook: (res, c) => {
			if (!res.success) {
				return c.json(
					{
						success: res.success,
						error: res.error,
					},
					UNPROCESSABLE_ENTITY,
				);
			}
		},
	});
}

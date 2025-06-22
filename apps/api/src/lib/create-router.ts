import type { HonoEnv } from "@/definitions/config.ts";
import { UNPROCESSABLE_ENTITY } from "@/definitions/http-status-code.ts";
import { OpenAPIHono } from "@hono/zod-openapi";

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

import { OK } from "@/definitions/http-status-code.ts";
import { createRouter } from "@/lib/create-router.ts";
import { z } from "zod";

const getHealthCheckResponseSchema = z.object({
	status: z.string(),
	timestamp: z.number(),
});

const health = createRouter().openapi(
	{
		method: "get",
		path: "/health",
		summary: "Health check endpoint",
		tags: ["Configuration"],
		responses: {
			[OK]: {
				description: "Health check response",
				content: {
					"application/json": {
						schema: getHealthCheckResponseSchema,
					},
				},
			},
		},
	},
	async (c) => {
		return c.json(
			{
				status: "ok",
				timestamp: Date.now(),
			},
			OK,
		);
	},
);

export { health };

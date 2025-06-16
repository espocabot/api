import { errorSchema } from "@/definitions/http-errors.ts";
import {
	getSteamPlaytimeInHoursParamsSchema,
	getSteamPlaytimeInHoursQuerySchema,
	getSteamPlaytimeInHoursResponseSchema,
} from "@/definitions/steam.ts";
import { createRouter } from "@/lib/create-router.ts";
import { isErr } from "@/lib/result.ts";
import { SteamProvider } from "@/providers/steam.ts";

const steam = createRouter().openapi(
	{
		method: "get",
		path: "/hours/{steam_id}/{app_id}",
		summary: "Get Steam playtime in hours",
		tags: ["Steam"],
		request: {
			params: getSteamPlaytimeInHoursParamsSchema,
			query: getSteamPlaytimeInHoursQuerySchema,
		},
		responses: {
			200: {
				description: "Playtime in hours",
				content: {
					"text/plain": {
						schema: getSteamPlaytimeInHoursResponseSchema,
					},
				},
			},
			400: {
				description: "Error fetching playtime",
				content: {
					"application/json": {
						schema: errorSchema,
					},
				},
			},
		},
	},
	async (c) => {
		const t = c.get("t");
		const { "text-format": textFormat } = c.req.valid("query");
		const { steam_id: steamId, app_id: appId } = c.req.valid("param");

		const provider = new SteamProvider();

		const playtimeResult = await provider.getPlaytime({
			appId,
			steamId,
		});

		if (isErr(playtimeResult)) {
			return c.json(
				{
					success: false as const,
					error: t("social.steam.error.playtime", { appId, steamId }),
				},
				400,
			);
		}

		const { playtimeInMinutes, gameName } = playtimeResult.value;

		return c.text(
			provider.getPlaytimeText(playtimeInMinutes, gameName, textFormat),
			200,
		);
	},
);

export { steam };

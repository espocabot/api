import { Hono } from "hono";

import type { HonoEnv } from "@/lib/definitions.ts";
import { logger } from "@/lib/logger.ts";
import { SteamProvider } from "@/providers/steam.ts";

const steam = new Hono<HonoEnv>();
// http://localhost:4343/api/pt-BR/steam/hours/76561198209279900/381210
steam.get("/hours/:steam_id/:app_id", async (c) => {
	const t = c.get("t");
	const { "text-format": textFormat, "custom-text": customText } =
		c.req.query();
	const { steam_id: steamId, app_id: appId } = c.req.param();

	try {
		const provider = new SteamProvider();

		const { playtimeMinutes } = await provider.getPlaytime({
			appId,
			steamId,
		});

		return c.text(
			provider.getPlaytimeText(
				playtimeMinutes,
				"Dead by Daylight",
				// @ts-ignore
				textFormat,
				customText,
			),
			200,
		);
	} catch (error) {
		logger("Error fetching Steam playtime");
		return c.json(
			{
				error: t("social.steam.error.playtime", { appId, steamId }),
			},
			500,
		);
	}
});

export { steam };

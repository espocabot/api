import { Hono } from "hono";

import type { HonoEnv } from "@/lib/definitions.ts";
import { logger } from "@/lib/logger";
import { SteamProvider } from "@/providers/steam";

const steam = new Hono<HonoEnv>();
// http://localhost:4343/api/pt-BR/steam/hours/76561198209279900/381210
steam.get("/hours/:steam_id/:app_id", async (c) => {
	const t = c.get("t");
	const { steam_id: steamId, app_id: appId } = c.req.param();

	try {
		const provider = new SteamProvider();

		const { playtime_hours, playtime_minutes } = await provider.getPlaytime({
			appId,
			steamId,
		});

		return c.json({ playtime_hours, playtime_minutes });
	} catch (error) {
		logger("Error fetching Steam playtime:");
		return c.json(
			{
				error: t("social.steam.error.playtime", { appId, steamId }),
			},
			500,
		);
	}
});

export { steam };

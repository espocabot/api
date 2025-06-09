import { getEnvs } from "@/lib/env";
import { getKV, setKV } from "@/lib/kv";
import { logger } from "@/lib/logger";
import { z } from "zod/v4-mini";

const DEFAULT_TTL_TIME = 2 * 60 * 60; // 2 hours

const playtimeSchema = z.object({
	playtime_hours: z.number(),
	playtime_minutes: z.number(),
});

type PlaytimeData = z.infer<typeof playtimeSchema>;

const responseSchema = z.object({
	response: z.object({
		games: z.array(
			z.object({
				appid: z.number(),
				playtime_forever: z.number(),
			}),
		),
	}),
});

export class SteamProvider {
	#baseUrl = "https://api.steampowered.com";

	async getPlaytime({ steamId, appId }: { steamId: string; appId: string }) {
		const cacheKey = `social:steam:playtime:${steamId}:${appId}`;
		const cached = await getKV<PlaytimeData>(cacheKey, "json");
		const { STEAM_WEB_API_KEY } = getEnvs();

		if (cached) {
			logger("Cache hit for:", cacheKey);
			return cached;
		}

		const res = await fetch(
			`${this.#baseUrl}/IPlayerService/GetOwnedGames/v1/?key=${STEAM_WEB_API_KEY}&steamid=${steamId}&include_appinfo=true&appids_filter[0]=${appId}&format=json`,
		);

		if (!res.ok) {
			logger(
				`Failed to fetch data from Steam API: ${res.status} ${res.statusText}`,
			);
			throw new Error("Failed to fetch data from Steam API");
		}

		const json = await res.json();
		const parsed = responseSchema.safeParse(json);

		if (!parsed.success) {
			logger("Failed to parse response from Steam API:", parsed.error.message);
			throw new Error("Failed to parse response from Steam API");
		}

		const firstGame = parsed.data.response.games[0];
		if (!firstGame) {
			logger("No games found for the given Steam ID and App ID.");
			throw new Error("No games found for the given Steam ID and App ID.");
		}

		const data = {
			playtime_hours: Math.round(firstGame.playtime_forever / 60),
			playtime_minutes: firstGame.playtime_forever,
		};

		logger("Fetched data from Steam API:", JSON.stringify(data));

		await setKV(cacheKey, JSON.stringify(data), {
			expirationTtl: DEFAULT_TTL_TIME,
		});

		return data;
	}
}

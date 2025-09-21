import {
	type CachedPlaytimeData,
	type PlaytimeTextFormat,
	getPlaytimeResponseDataFromSteamSchema,
} from "@/definitions/steam.ts";
import { getTimeInfoFromMinutes } from "@/helpers/timers.ts";
import { getEnvs } from "@/lib/env.ts";
import { getKV, setKV } from "@/lib/kv.ts";
import { logger } from "@/lib/logger.ts";
import { type AyncResult, type Result, err, ok } from "@/lib/result.ts";
import { getTranslator } from "@/lib/translator.ts";

const DEFAULT_TTL_TIME = 60 * 15; // 15 minutes

export class SteamProvider {
	#baseUrl = "https://api.steampowered.com";

	async getPlaytime({ steamId, appId }: { steamId: string; appId: string }) {
		const cacheKey = `social:steam:playtime:${steamId}:${appId}`;
		const cached = await getKV<CachedPlaytimeData>(cacheKey, "json");
		const { STEAM_WEB_API_KEY } = getEnvs();

		if (cached) {
			logger("Cache hit for:", cacheKey);
			return ok(cached);
		}

		const res = await fetch(
			`${this.#baseUrl}/IPlayerService/GetOwnedGames/v1/?key=${STEAM_WEB_API_KEY}&steamid=${steamId}&include_appinfo=true&appids_filter[0]=${appId}&format=json`,
		);

		if (!res.ok) {
			logger(
				`Failed to fetch data from Steam API: ${res.status} ${res.statusText}`,
			);
			return err(new Error("Failed to fetch data from Steam API"));
		}

		const json = await res.json();
		const parsed = getPlaytimeResponseDataFromSteamSchema.safeParse(json);

		if (!parsed.success) {
			logger("Failed to parse response from Steam API:", parsed.error.message);
			return err(new Error("Failed to parse response from Steam API"));
		}

		const firstGame = parsed.data.response.games[0];
		if (!firstGame) {
			logger("No games found for the given Steam ID and App ID.");
			return err(
				new Error("No games found for the given Steam ID and App ID."),
			);
		}

		const data: CachedPlaytimeData = {
			playtimeInMinutes: firstGame.playtime_forever,
			gameName: firstGame.name,
		};

		logger("Fetched data from Steam API:", JSON.stringify(data));

		await setKV(cacheKey, JSON.stringify(data), {
			expirationTtl: DEFAULT_TTL_TIME,
		});

		return ok(data);
	}

	getPlaytimeText(
		playtimeMinutes: number,
		gameName: string,
		format: PlaytimeTextFormat,
	) {
		const timeInfoFromMinutes = getTimeInfoFromMinutes(playtimeMinutes);
		const t = getTranslator();

		const key = `social.steam.hours.${format}` as const;

		logger(
			`Using format key: ${key} with time info: ${playtimeMinutes} and game title: ${gameName}`,
		);
		return t(key, { ...timeInfoFromMinutes, gameName });
	}
}

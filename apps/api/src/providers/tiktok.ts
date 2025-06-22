import { interpolate, mediaNumber } from "@/helpers/formatters.ts";
import { getEnvs } from "@/lib/env.ts";
import { logger } from "@/lib/logger.ts";
import { getTranslator } from "@/lib/translator.ts";
import { z } from "zod/v4-mini";

type LastestVideoTextFormat = "default" | "short" | "with-emoji" | "custom";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_IN_MS = 7 * ONE_DAY_IN_MS;
const ONE_MONTH_IN_MS = 30 * ONE_DAY_IN_MS;
const NINETY_DAYS_IN_MS = 90 * ONE_DAY_IN_MS;

const videoPeriod = {
	"last-24-hours": {
		start: new Date(Date.now() - ONE_DAY_IN_MS),
		end: new Date(),
	},
	"last-7-days": {
		start: new Date(Date.now() - ONE_WEEK_IN_MS),
		end: new Date(),
	},
	"last-30-days": {
		start: new Date(Date.now() - ONE_MONTH_IN_MS),
		end: new Date(),
	},
	"last-90-days": {
		start: new Date(Date.now() - NINETY_DAYS_IN_MS),
		end: new Date(),
	},
} as const;

type VideoPeriod = keyof typeof videoPeriod;

type TikTokVideo = {
	title: string;
	url: string;
	likes: number;
	views: number;
	comments: number;
	shares: number;
	createdAt: string;
};

const getAccessTokenResponseSchema = z.object({
	access_token: z.string(),
	expires_in: z.number(),
	token_type: z.literal("Bearer"),
});

export class TikTokProvider {
	#baseUrl = "https://open.tiktokapis.com";

	async requestClientAccessToken() {
		const { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET_KEY } = getEnvs();
		try {
			const response = await fetch(`${this.#baseUrl}/v2/oauth/token/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					client_key: TIKTOK_CLIENT_KEY,
					client_secret: TIKTOK_CLIENT_SECRET_KEY,
					grant_type: "client_credentials",
				}),
			});

			if (!response.ok) {
				logger(
					`Failed to fetch TikTok access token: ${response.status} ${response.statusText}`,
				);
				throw new Error(
					`Failed to fetch TikTok access token: ${response.status} ${response.statusText}`,
				);
			}

			const json = await response.json();
			const parsed = getAccessTokenResponseSchema.parse(json);
			console.log("TikTok access token response:", parsed);

			logger("TikTok access token fetched successfully");
			return parsed;
		} catch (error) {
			logger("Error fetching TikTok access token");
			throw new Error("Failed to fetch TikTok access token");
		}
	}

	async getLatestVideo(
		handle: string,
		period: VideoPeriod = "last-7-days",
	): Promise<TikTokVideo | null> {
		const body = {
			fields:
				"id,create_time,video_description,like_count,comment_count,view_count,share_count,username",
			query: {
				and: [
					{
						field: "username",
						operator: "eq",
						field_values: [handle],
					},
				],
			},
			start_date: videoPeriod[period].start,
			end_date: videoPeriod[period].end,
			max_count: 10,
		};

		const accessTokenResponse = await this.requestClientAccessToken();
		const accessToken = accessTokenResponse.access_token;

		const res = await fetch(`${this.#baseUrl}/v2/research/video/query`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(body),
		});

		if (!res.ok) {
			const text = await res.text();
			console.log("sim", text, res);
			logger(
				`Failed to fetch data from TikTok API: ${res.status} ${res.statusText}`,
			);
			throw new Error("Failed to fetch data from TikTok API");
		}

		const data = (await res.json()) as {
			data?: {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				videos?: Array<any>;
			};
		};
		logger("Fetched data from TikTok API:", JSON.stringify(data));

		if (data?.data?.videos?.length && data.data.videos.length > 0) {
			const lastVideo = data.data.videos.reduce((prev, current) =>
				prev.create_time > current.create_time ? prev : current,
			);
			const result = {
				title: lastVideo.video_description,
				url: `https://www.tiktok.com/@${lastVideo.username}/video/${lastVideo.id}`,
				likes: lastVideo.like_count,
				comments: lastVideo.comment_count,
				views: lastVideo.view_count,
				shares: lastVideo.share_count,
				createdAt: new Date(lastVideo.create_time * 1000).toISOString(),
			};
			logger("Latest video metadata:", JSON.stringify(result));
			return result;
		}
		logger("No videos found for the given handle:", handle);
		return null;
	}

	getLatestVideoText(
		videoMetadata: TikTokVideo,
		format: LastestVideoTextFormat,
		customText = "{title} - {url}",
	) {
		const videoMetadataWithDefaults = {
			title: videoMetadata.title,
			url: videoMetadata.url,
			likes: mediaNumber(videoMetadata.likes),
			views: mediaNumber(videoMetadata.views),
			comments: mediaNumber(videoMetadata.comments),
			shares: mediaNumber(videoMetadata.shares),
			createdAt: videoMetadata.createdAt,
		};
		const t = getTranslator();
		switch (format) {
			case "short":
				return t(
					"social.tiktok.latest-video-text.short",
					videoMetadataWithDefaults,
				);
			case "with-emoji":
				return t(
					"social.tiktok.latest-video-text.with-emoji",
					videoMetadataWithDefaults,
				);
			case "custom":
				return customText
					? interpolate(customText, {
							title: videoMetadataWithDefaults.title,
							url: videoMetadataWithDefaults.url,
							likes: videoMetadataWithDefaults.likes,
							views: videoMetadataWithDefaults.views,
							comments: videoMetadataWithDefaults.comments,
							shares: videoMetadataWithDefaults.shares,
							createdAt: videoMetadataWithDefaults.createdAt,
						})
					: customText;
			default:
				return t(
					"social.tiktok.latest-video-text.default",
					videoMetadataWithDefaults,
				);
		}
	}
}

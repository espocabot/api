import { getEnvs } from '@/lib/env.ts';
import { logger } from '@/lib/logger.ts';
import { z } from 'zod';

const channelDataResponseSchema = z.object({
	items: z.array(
		z.object({
			contentDetails: z.object({
				relatedPlaylists: z.object({
					uploads: z.string(),
				}),
			}),
		}),
	),
});

const playlistItemsResponseSchema = z.object({
	kind: z.string(),
	etag: z.string(),
	nextPageToken: z.string().optional(),
	prevPageToken: z.string().optional(),
	pageInfo: z.object({
		totalResults: z.number(),
		resultsPerPage: z.number(),
	}),
	items: z.array(z.lazy(() => playlistItemSchema)),
});

const playlistItemSchema = z.object({
	kind: z.string(),
	etag: z.string(),
	id: z.string(),
	snippet: z.object({
		publishedAt: z.string(),
		channelId: z.string(),
		title: z.string(),
		description: z.string().optional(),
		thumbnails: z.object({
			default: z.object({
				url: z.string(),
				width: z.number(),
				height: z.number(),
			}),
			medium: z.object({
				url: z.string(),
				width: z.number(),
				height: z.number(),
			}),
			high: z.object({
				url: z.string(),
				width: z.number(),
				height: z.number(),
			}),
		}),
		channelTitle: z.string(),
		playlistId: z.string(),
		position: z.number(),
		resourceId: z.object({
			kind: z.string(),
			videoId: z.string(),
		}),
	}),
});

export class YoutubeProvider {
	#baseUrl = 'https://www.googleapis.com/youtube/v3';

	async getChannelDetails({ channelId }: { channelId: string }) {
		const { YOUTUBE_API_KEY } = getEnvs();

		try {
			const channelResponse = await fetch(
				`${this.#baseUrl}/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`,
			);

			if (!channelResponse.ok) {
				logger(
					`Failed to fetch channel details: ${channelResponse.statusText}`,
				);
				throw new Error(
					`Failed to fetch channel details: ${channelResponse.statusText}`,
				);
			}

			const channelData = await channelResponse.json();

			const parsedChannelData = channelDataResponseSchema.parse(channelData);

			if (!parsedChannelData.items.length) {
				// TODO: define if returning null or throwing an error is better
				logger(`No items found for channel ID: ${channelId}`);
				throw new Error(`No items found for channel ID: ${channelId}`);
			}

			const firstItem = parsedChannelData.items[0];
			if (!firstItem) {
				logger(`Uploads playlist ID not found for channel ID: ${channelId}`);
				throw new Error(
					`Uploads playlist ID not found for channel ID: ${channelId}`,
				);
			}

			return firstItem;
		} catch (error) {
			logger(`Error fetching channel details for ID ${channelId}`);
			throw error;
		}
	}

	async getLatestContent({ channelId }: { channelId: string }) {
		const { YOUTUBE_API_KEY } = getEnvs();

		try {
			const channelResponse = await fetch(
				`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`,
			);

			if (!channelResponse.ok) {
				logger(
					`Failed to fetch channel details: ${channelResponse.statusText}`,
				);
				throw new Error(
					`Failed to fetch channel details: ${channelResponse.statusText}`,
				);
			}

			const channelData = await channelResponse.json();

			const parsedChannelData = channelDataResponseSchema.parse(channelData);

			if (!parsedChannelData.items.length) {
				// TODO: define if returning null or throwing an error is better
				logger(`No items found for channel ID: ${channelId}`);
				throw new Error(`No items found for channel ID: ${channelId}`);
			}

			const firstItem = parsedChannelData.items[0];
			if (!firstItem) {
				logger(`Uploads playlist ID not found for channel ID: ${channelId}`);
				throw new Error(
					`Uploads playlist ID not found for channel ID: ${channelId}`,
				);
			}
			const uploadsPlaylistId =
				firstItem.contentDetails.relatedPlaylists.uploads;

			const getPlaylistDataParams = new URLSearchParams({
				part: 'snippet',
				maxResults: '50',
				order: 'date',
				playlistId: uploadsPlaylistId,
				key: YOUTUBE_API_KEY,
			});

			const playlistResponse = await fetch(
				`https://www.googleapis.com/youtube/v3/playlistItems?${getPlaylistDataParams.toString()}`,
			);

			if (!playlistResponse.ok) {
				logger(
					`Failed to fetch playlist items: ${playlistResponse.statusText}`,
				);
				throw new Error(
					`Failed to fetch playlist items: ${playlistResponse.statusText}`,
				);
			}

			const playlistData = await playlistResponse.json();
			const parsedPlaylistData =
				playlistItemsResponseSchema.parse(playlistData);

			if (!parsedPlaylistData.items.length) {
				// TODO: define if returning null or throwing an error is better
				logger(`No items found in playlist ID: ${uploadsPlaylistId}`);
				throw new Error(`No items found in playlist ID: ${uploadsPlaylistId}`);
			}
		} catch (error) {
			logger(
				`Error fetching latest content for channel ID ${channelId}: ${error}`,
			);
			throw error;
		}
	}
}

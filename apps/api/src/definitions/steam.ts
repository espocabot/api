import { z } from 'zod';

export const playtimeTextFormatSchema = z.union([
	z.literal('standard'),
	z.literal('compact'),
	z.literal('detailed'),
	z.literal('compact-with-seconds'),
	z.literal('extended'),
	z.literal('minimal'),
	z.literal('full'),
	z.literal('short-time'),
	z.literal('precise'),
	z.literal('casual'),
]);

export type PlaytimeTextFormat = z.infer<typeof playtimeTextFormatSchema>;

export const getSteamPlaytimeInHoursParamsSchema = z.object({
	steam_id: z.string().describe('Steam ID of the user'),
	app_id: z.string().describe('App ID of the game'),
});

export const getSteamPlaytimeInHoursQuerySchema = z.object({
	'text-format': playtimeTextFormatSchema
		.optional()
		.default('standard')
		.describe('Format for the text response'),
});

export const getSteamPlaytimeInHoursResponseSchema = z
	.string()
	.describe('Text response with the playtime in hours');

export const getPlaytimeResponseDataFromSteamSchema = z.object({
	response: z.object({
		games: z.array(
			z.object({
				appid: z.number().describe('Unique identifier for the game'),
				playtime_forever: z
					.number()
					.describe(
						'The total number of minutes played "on record", since Steam began tracking total playtime in early 2009',
					),
				name: z.string().describe('The name of the game'),
			}),
		),
	}),
});

export const cachedPlatimeDataSchema = z.object({
	playtimeInMinutes: z.number().describe('Playtime in minutes'),
	gameName: z.string().describe('Name of the game'),
});

export type CachedPlaytimeData = z.infer<typeof cachedPlatimeDataSchema>;

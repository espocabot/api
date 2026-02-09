import { z } from 'zod';

export const getCountdownToDateTimeQuerySchema = z.object({
	datetime: z
		.string()
		.datetime()
		.describe(
			"The date and time to count down to, in ISO 8601 format (e.g., '2023-12-31T23:59:59Z')",
		),
	'text-format': z
		.union([z.literal('full'), z.literal('short')])
		.optional()
		.default('full')
		.describe(
			"Format of the countdown text. 'full' for detailed format, 'short' for abbreviated format",
		),
});

export const getCountdownToDateTimeResponseSchema = z
	.string()
	.describe('Countdown in days, hours, minutes, and seconds');

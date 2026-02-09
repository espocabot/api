import { z } from 'zod';

export const errorSchema = z.object({
	success: z
		.literal(false)
		.optional()
		.default(false)
		.describe('Indicates that the operation failed'),
	error: z.string().describe('Error message describing the failure'),
});

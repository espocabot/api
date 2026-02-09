import {
	getCountdownToDateTimeQuerySchema,
	getCountdownToDateTimeResponseSchema,
} from '@/definitions/datetime.ts';
import { OK } from '@/definitions/http-status-code.ts';
import { createRouter } from '@/lib/create-router.ts';
import { logger } from '@/lib/logger.ts';

const datetime = createRouter().openapi(
	{
		method: 'get',
		path: '/date-time/countdown',
		summary: 'Get countdown to a specific date and time',
		tags: ['DateTime'],
		request: {
			query: getCountdownToDateTimeQuerySchema,
		},
		responses: {
			[OK]: {
				description: 'Countdown to the specified date and time',
				content: {
					'text/plain': {
						schema: getCountdownToDateTimeResponseSchema,
					},
				},
			},
		},
	},
	async (c) => {
		const t = c.get('t');
		const { datetime, 'text-format': textFormat } = c.req.valid('query');
		const targetDate = new Date(datetime);
		const now = new Date();

		const timeDifference = targetDate.getTime() - now.getTime();
		if (timeDifference < 0) {
			// i know this is not the best way to handle this, but it works for now,
			// because i need to show a default message when the date is in the past
			return c.text(t('miscellaneous.date-time.error.already-passed'), OK);
		}

		const seconds = Math.floor(timeDifference / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		const key = `miscellaneous.date-time.countdown.${textFormat}` as const;

		logger(
			`Countdown to ${targetDate.toISOString()} - Days: ${days}, Hours: ${hours % 24}, Minutes: ${minutes % 60}, Seconds: ${seconds % 60}`,
		);

		return c.text(
			t(key, {
				days: days,
				hours: hours % 24,
				minutes: minutes % 60,
				seconds: seconds % 60,
			}),
			OK,
		);
	},
);

export { datetime };

import { NOT_FOUND } from '@/definitions/http-status-code.ts';
import { NOT_FOUND as NOT_FOUND_MESSAGE } from '@/definitions/http-status-phrases.ts';
import type { NotFoundHandler } from 'hono';

const notFound: NotFoundHandler = (c) => {
	return c.json(
		{
			message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
		},
		NOT_FOUND,
	);
};

export function notFoundMiddleware() {
	return notFound;
}

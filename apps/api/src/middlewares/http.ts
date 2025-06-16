import type { NotFoundHandler } from "hono";

import { NOT_FOUND } from "@/lib/http/http-status-code.ts";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "@/lib/http/http-status-phrases.ts";

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

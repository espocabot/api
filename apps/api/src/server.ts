import { contextStorage } from "hono/context-storage";
import { csrf } from "hono/csrf";
import { languageDetector } from "hono/language";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { logger as customLogger } from "@/lib/logger.ts";
import { i18nMiddleware } from "@/middlewares/i18n.js";
import { health } from "@/routes/config/health.ts";
import { steam } from "@/routes/social/steam.ts";
import { createRouter } from "./lib/create-router.ts";
import { notFoundMiddleware } from "./middlewares/http.ts";
import { datetime } from "./routes/miscellaneous/datetime.ts";
// import { tiktok } from "@/routes/social/tiktok.ts";

const docConfig = {
	openapi: "3.1.0",
	info: {
		title: "API Documentation",
		version: "1.0.0",
		description: "API documentation for the application.",
	},
	servers: [
		{
			url: "https://api.espoca.bot",
			description: "Production server",
		},
	],
};

const app = createRouter();

app.use(contextStorage());
app.use(csrf());
app.use(secureHeaders());
app.use(logger(customLogger));
app.doc31("/docs", docConfig);
app.getOpenAPI31Document(docConfig);
// app.onError((err, c) => {
// 	if (err instanceof HTTPException) {
// 		return err.getResponse();
// 	}

// 	return c.json(
// 		{
// 			error: "Internal Server Error",
// 			message: err.message,
// 		},
// 		500,
// 	);
// });
app.use(
	languageDetector({
		order: ["path", "querystring", "header", "cookie"],
		lookupFromPathIndex: 1,
		supportedLanguages: ["en-US", "pt-BR"],
		fallbackLanguage: "en-US",
	}),
);
app.notFound(notFoundMiddleware());
app.use("*", i18nMiddleware());

// app.route("/api/:lang/tiktok", tiktok);
app.route("/api/:lang/steam", steam);
app.route("/api/:lang/misc", datetime);
app.route("/health", health);

export default app;

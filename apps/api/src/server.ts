import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { csrf } from "hono/csrf";
import { languageDetector } from "hono/language";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { logger as customLogger } from "@/lib/logger.ts";
import { i18nMiddleware } from "@/middlewares/i18n.js";
import { health } from "@/routes/config/health.ts";
import { steam } from "@/routes/social/steam.ts";
// import { tiktok } from "@/routes/social/tiktok.ts";

const app = new Hono();

app.use(contextStorage());
app.use(csrf());
app.use(secureHeaders());
app.use(logger(customLogger));
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
		order: ['path', 'cookie', 'querystring', 'header'],
		lookupFromPathIndex: 1,
		supportedLanguages: ["en-US", "pt-BR"],
		fallbackLanguage: "en-US",
	}),
);
app.use("*", i18nMiddleware());

// app.route("/api/:lang/tiktok", tiktok);
app.route("/api/:lang/steam", steam);
app.route("/health", health);

export default app;

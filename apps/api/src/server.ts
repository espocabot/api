import { Hono } from "hono";
import { cache } from "hono/cache";
import { csrf } from "hono/csrf";
import { languageDetector } from "hono/language";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { logger as customLogger } from "@/lib/logger.ts";
import { contextStorage } from "hono/context-storage";
import { i18nMiddleware } from "./middlewares/i18n.js";
import { steam } from "./routes/social/steam.ts";

const app = new Hono().basePath("/api/:lang");

app.use(contextStorage());
app.use(csrf());
app.use(secureHeaders());
app.use(logger(customLogger));
app.get(
	"*",
	cache({
		cacheName: "my-app",
		cacheControl: "max-age=3600",
	}),
);
app.use(
	languageDetector({
		supportedLanguages: ["en", "pt-BR"],
		fallbackLanguage: "en",
	}),
);
app.use("*", i18nMiddleware());

app.get("/", (c) => {
	return c.json({
		message: "Welcome to the Spark API",
		version: "1.0.0",
	});
});

app.route("/steam", steam);

export default app;

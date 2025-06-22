import i18n from "@/lib/i18n/index.ts";
import type { Context } from "hono";

export function i18nMiddleware() {
	return async (c: Context, next: () => Promise<void>) => {
		await i18n.changeLanguage(c.get("language"));
		c.set("t", i18n.t.bind(i18n));
		await next();
	};
}

import { Hono } from "hono";

import type { HonoEnv } from "@/lib/definitions.ts";
import { TikTokProvider } from "@/providers/tiktok.ts";

const tiktok = new Hono<HonoEnv>();

tiktok.get("/:handle/latest", async (c) => {
	const t = c.get("t");
	const { "text-format": textFormat, "custom-text": customText } =
		c.req.query();
	const { handle } = c.req.param();

	try {
		const provider = new TikTokProvider();
		const latest = await provider.getLatestVideo(handle);

		// @ts-ignore
		return c.text(provider.getLatestVideoText(latest, textFormat, customText));
	} catch (error) {
		return c.json(
			{ error: t("social.tiktok.error.latest-video", { handle }) },
			500,
		);
	}
});

export { tiktok };

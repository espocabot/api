import type i18n from '@/lib/i18n/index.ts';

export type HonoEnv = {
	Variables: {
		t: typeof i18n.t;
	};
	Bindings: {
		STEAM_WEB_API_KEY: string;
		TIKTOK_CLIENT_KEY: string;
		TIKTOK_CLIENT_SECRET_KEY: string;
		YOUTUBE_API_KEY: string;
		KV: KVNamespace;
	};
};

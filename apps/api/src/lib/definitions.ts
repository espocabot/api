import type i18n from "@/lib/i18n/index.ts";

export type HonoEnv = {
	Variables: {
		t: typeof i18n.t;
	};
	Bindings: {
		STEAM_WEB_API_KEY: string;
		ESPOCABOT_SPARK_API_CACHE: KVNamespace;
	};
};

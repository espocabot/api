import type { defaultNS, resources } from "@/lib/i18n/index.ts";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: typeof defaultNS;
		resources: typeof resources;
	}
}

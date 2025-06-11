import i18next from "i18next";

// Use Javascript Tags (BCP 47) - https://www.techonthenet.com/js/language_tags.php
import enUS from "./locales/en-US.json" with { type: "json" };
import ptBR from "./locales/pt-BR.json" with { type: "json" };

export const defaultNS = "translation";

export type SupportedLanguages = "en-US" | "pt-BR";

export const resources = {
	translation: enUS,
} as const;

await i18next.init({
	fallbackLng: "en-US",
	defaultNS,
	resources: {
		"en-US": { translation: enUS },
		"pt-BR": { translation: ptBR },
	},
});

export default i18next;

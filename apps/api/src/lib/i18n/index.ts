import i18next from 'i18next';
import ICU from 'i18next-icu';
// Use Javascript Tags (BCP 47) - https://www.techonthenet.com/js/language_tags.php
import enUS from './locales/en-US.json' with { type: 'json' };
import ptBR from './locales/pt-BR.json' with { type: 'json' };

export const defaultNS = 'translation';

export type SupportedLanguages = 'en-US' | 'pt-BR';

export const resources = {
	[defaultNS]: enUS,
} as const;

await i18next.use(ICU).init({
	fallbackLng: 'en-US',
	ns: [defaultNS],
	defaultNS,
	interpolation: {
		escapeValue: false,
	},
	resources: {
		'en-US': { [defaultNS]: enUS },
		'pt-BR': { [defaultNS]: ptBR },
	},
	debug: false,
});

export default i18next;

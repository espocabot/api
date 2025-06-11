import type { SupportedLanguages } from "@/lib/i18n/index.ts";

export function interpolate(
	text: string,
	variables: Record<string, string | number>,
): string {
	return text.replace(/{(.*?)}/g, (_, key) =>
		variables[key] != null ? String(variables[key]) : `{${key}}`,
	);
}

export function mediaNumber(
	value: number,
	locale: SupportedLanguages = "en-US",
) {
	return new Intl.NumberFormat(locale, {
		notation: "compact",
		compactDisplay: "short",
	}).format(value);
}

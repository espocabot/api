import { describe, expect, it } from "bun:test";
import { interpolate } from "./formatters.ts";

describe("interpolate", () => {
	it("should replace placeholders with corresponding variable values", () => {
		const text = "Hello, {name}! You have {count} new messages.";
		const variables = { name: "Alice", count: 5 };
		const result = interpolate(text, variables);
		expect(result).toBe("Hello, Alice! You have 5 new messages.");
	});

	it("should leave placeholders unchanged if variable is missing", () => {
		const text = "Hello, {name}! You have {count} new messages.";
		const variables = { name: "Bob" };
		const result = interpolate(text, variables);
		expect(result).toBe("Hello, Bob! You have {count} new messages.");
	});

	it("should handle multiple occurrences of the same placeholder", () => {
		const text = "{greeting}, {name}! {greeting} again!";
		const variables = { greeting: "Hi", name: "Charlie" };
		const result = interpolate(text, variables);
		expect(result).toBe("Hi, Charlie! Hi again!");
	});
});

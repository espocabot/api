export type Result<T, E = Error> =
	| { success: true; value: T }
	| { success: false; error: E };

export type AyncResult<T, E = Error> =
	| { success: true; value: Promise<T> }
	| { success: false; error: E };

/**
 * Creates a successful result with the given value.
 * @param value The value to return in the result.
 * @returns A Result object indicating success.
 * @example
 * ```typescript
 * import { ok } from './result.ts';
 * const result = ok("Success!"); // result will be { success: true, value: "Success!" }
 * ```
 */
export function ok<T>(value: T): Result<T> {
	return { success: true, value };
}

/**
 * Creates an error result with the given error.
 * @param error The error to return in the result.
 * @returns A Result object indicating failure.
 * @example
 * ```typescript
 * import { err } from './result.ts';
 * const result = err(new Error("Something went wrong")); // result will be { success: false, error: Error("Something went wrong") }
 * ```
 */
export function err<E>(error: E): Result<never, E> {
	return { success: false, error };
}

/**
 * Type guard to check if the result is a success.
 * @param result The result to check.
 * @returns True if the result is a success, false otherwise.
 * @example
 * ```typescript
 * import { isOk } from './result.ts';
 * const result = ok("Success!");
 * console.log(isOk(result)); // true
 * ```
 */
export function isOk<T, E = Error>(
	result: Result<T, E>,
): result is { success: true; value: T } {
	return result.success === true;
}

/**
 * Type guard to check if the result is an error.
 * @param result The result to check.
 * @returns True if the result is an error, false otherwise.
 * @example
 * ```typescript
 * import { isErr } from './result.ts';
 * const result = err(new Error("Something went wrong"));
 * console.log(isErr(result)); // true
 * ```
 */
export function isErr<T, E = Error>(
	result: Result<T, E>,
): result is { success: false; error: E } {
	return result.success === false;
}

/**
 * Unwraps the value from a successful result.
 * @param result The result to unwrap.
 * @returns The value if the result is successful.
 * @throws The error if the result is an error.
 * @example
 * ```typescript
 * import { unwrap } from './result.ts';
 * const result = ok("Success!");
 * console.log(unwrap(result)); // "Success!"
 * ```
 */
export function unwrap<T, E = Error>(result: Result<T, E>): T {
	if (isOk(result)) {
		return result.value;
	}
	throw result.error;
}

/**
 * Unwraps the value from a successful result or returns a default value.
 * @param result The result to unwrap.
 * @param defaultValue The default value to return if the result is an error.
 * @returns The value if the result is successful, otherwise the default value.
 * @example
 * ```typescript
 * import { unwrapOr } from './result.ts';
 * const result = err(new Error("Something went wrong"));
 * console.log(unwrapOr(result, "Default Value")); // "Default Value"
 * ```
 */
export function unwrapOr<T, E = Error>(
	result: Result<T, E>,
	defaultValue: T,
): T {
	return isOk(result) ? result.value : defaultValue;
}

/**
 * Unwraps the value from a successful result or throws an error.
 * @param result The result to unwrap.
 * @param error The error to throw if the result is an error.
 * @returns The value if the result is successful.
 * @throws The provided error if the result is an error.
 * @example
 * ```typescript
 * import { unwrapOrThrow } from './result.ts';
 * const result = err(new Error("Something went wrong"));
 * try {
 *   console.log(unwrapOrThrow(result, new Error("Custom Error")));
 * } catch (e) {
 *   console.error(e); // Custom Error
 * }
 * ```
 */
export function unwrapOrThrow<T, E = Error>(result: Result<T, E>, error: E): T {
	if (isOk(result)) {
		return result.value;
	}
	throw error;
}

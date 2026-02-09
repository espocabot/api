import { getContext } from 'hono/context-storage';
import type { HonoEnv } from '@/definitions/config.ts';

export function getTranslator() {
	return getContext<HonoEnv>().var.t;
}

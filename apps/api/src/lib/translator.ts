import type { HonoEnv } from '@/definitions/config.ts';
import { getContext } from 'hono/context-storage';

export function getTranslator() {
	return getContext<HonoEnv>().var.t;
}

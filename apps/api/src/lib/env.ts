import { getContext } from 'hono/context-storage';
import type { HonoEnv } from '@/definitions/config.ts';

export function getEnvs() {
	return getContext<HonoEnv>().env;
}

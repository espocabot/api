'use client';

import type { ReactNode } from 'react';
import { Toaster } from './ui/sonner';
import { TooltipProvider } from './ui/tooltip';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<TooltipProvider>
			{children}
			<Toaster />
		</TooltipProvider>
	);
}

'use client';

import { createContext, MutableRefObject, ReactNode, useRef } from 'react';
import { PlayGeneral } from '@/lib/logic/packages/generals/play.general';

interface PlayContextModel {
	generalRef: MutableRefObject<PlayGeneral>;
}

export const PlayContext = createContext<PlayContextModel | undefined>(
	undefined
);

export const PlayContextProvider = ({ children }: { children: ReactNode }) => {
	const generalRef = useRef<PlayGeneral>(new PlayGeneral());

	return (
		<PlayContext.Provider
			value={{
				generalRef
			}}
		>
			{children}
		</PlayContext.Provider>
	);
};

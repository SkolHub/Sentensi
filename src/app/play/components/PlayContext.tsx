'use client';

import {
	createContext,
	Dispatch,
	MutableRefObject,
	ReactNode,
	SetStateAction,
	useRef,
	useState
} from 'react';
import { PlayGeneral } from '@/lib/logic/packages/generals/play.general';

interface PlayContextModel {
	generalRef: MutableRefObject<PlayGeneral>;
	updater: boolean;
	setUpdater: Dispatch<SetStateAction<boolean>>;
	selected: number;
	setSelected: Dispatch<SetStateAction<number>>;
}

export const PlayContext = createContext<PlayContextModel | undefined>(
	undefined
);

export const PlayContextProvider = ({ children }: { children: ReactNode }) => {
	const generalRef = useRef<PlayGeneral>(new PlayGeneral());
	const [updater, setUpdater] = useState<boolean>(false);
	const [selected, setSelected] = useState<number>(-1);

	return (
		<PlayContext.Provider
			value={{
				generalRef,
				updater,
				setUpdater,
				selected,
				setSelected
			}}
		>
			{children}
		</PlayContext.Provider>
	);
};

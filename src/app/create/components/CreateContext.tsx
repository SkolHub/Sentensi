'use client';

import {
	createContext,
	Dispatch,
	MutableRefObject,
	ReactNode,
	SetStateAction,
	useRef,
	useState,
} from 'react';
import { CreateGeneral } from '@/lib/logic/packages/generals/create-general';

interface CreateContextModel {
	color: string;
	setColor: Dispatch<SetStateAction<string>>;
	doubleColor: boolean;
	setDoubleColor: Dispatch<SetStateAction<boolean>>;
	sizingMode: 'stretch' | 'scale';
	setSizingMode: Dispatch<SetStateAction<'stretch' | 'scale'>>;
	fontSize: number;
	setFontSize: Dispatch<SetStateAction<number>>;
	mode: 'canvas' | 'text';
	setMode: Dispatch<SetStateAction<'canvas' | 'text'>>;
	pen: boolean;
	setPen: Dispatch<SetStateAction<boolean>>;
	eraser: boolean;
	setEraser: Dispatch<SetStateAction<boolean>>;
	generalRef: MutableRefObject<CreateGeneral>;
	canvasTextBox: string[];
	setCanvasTextBox: Dispatch<SetStateAction<string[]>>;
	updater: boolean;
	setUpdater: Dispatch<SetStateAction<boolean>>;
	selected: number;
	setSelected: Dispatch<SetStateAction<number>>;
}

export const CreateContext = createContext<CreateContextModel | undefined>(
	undefined,
);

export const CreateContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [color, setColor] = useState<string>('#000000');
	const [doubleColor, setDoubleColor] = useState<boolean>(false);
	const [sizingMode, setSizingMode] = useState<'stretch' | 'scale'>('stretch');
	const [fontSize, setFontSize] = useState<number>(3);
	const [mode, setMode] = useState<'canvas' | 'text'>('canvas');
	const [pen, setPen] = useState<boolean>(false);
	const [eraser, setEraser] = useState<boolean>(false);

	const generalRef = useRef<CreateGeneral>(new CreateGeneral());

	const [canvasTextBox, setCanvasTextBox] = useState<string[]>(['']);

	const [updater, setUpdater] = useState<boolean>(false);

	const [selected, setSelected] = useState<number>(-1);

	return (
		<CreateContext.Provider
			value={{
				color,
				setColor,
				doubleColor,
				setDoubleColor,
				sizingMode,
				setSizingMode,
				fontSize,
				setFontSize,
				mode,
				setMode,
				pen,
				setPen,
				eraser,
				setEraser,
				generalRef,
				canvasTextBox,
				setCanvasTextBox,
				updater,
				setUpdater,
				selected,
				setSelected
			}}
		>
			{children}
		</CreateContext.Provider>
	);
};
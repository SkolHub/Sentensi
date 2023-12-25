import {
	createContext,
	Dispatch,
	MutableRefObject,
	ReactNode,
	SetStateAction,
	useRef,
	useState
} from 'react';
import { CreateGeneral } from '../../../logic/packages/generals/create-general';

interface CreateContextModel {
	color: string;
	setColor: Dispatch<SetStateAction<string>>;
	doubleColor: boolean;
	setDoubleColor: Dispatch<SetStateAction<boolean>>;
	sizingMode: 'stretch' | 'scale';
	setSizingMode: Dispatch<SetStateAction<'stretch' | 'scale'>>;
	mode: 'canvas' | 'text';
	setMode: Dispatch<SetStateAction<'canvas' | 'text'>>;
	pen: boolean;
	setPen: Dispatch<SetStateAction<boolean>>;
	eraser: boolean;
	setEraser: Dispatch<SetStateAction<boolean>>;
	generalRef: MutableRefObject<CreateGeneral>;
	words: string[];
	setWords: Dispatch<SetStateAction<string[]>>;
}

export const CreateContext = createContext<CreateContextModel | undefined>(undefined);

export const CreateContextProvider = ({ children }: { children: ReactNode }) => {
	const [color, setColor] = useState<string>('#000000');
	const [doubleColor, setDoubleColor] = useState<boolean>(false);
	const [sizingMode, setSizingMode] = useState<'stretch' | 'scale'>('stretch');
	const [mode, setMode] = useState<'canvas' | 'text'>('canvas');
	const [pen, setPen] = useState<boolean>(false);
	const [eraser, setEraser] = useState<boolean>(false);

	const generalRef = useRef<CreateGeneral>(new CreateGeneral());

	const [words, setWords] = useState<string[]>(['']);

	return (
		<CreateContext.Provider
			value={{
				color,
				setColor,
				doubleColor,
				setDoubleColor,
				sizingMode,
				setSizingMode,
				mode,
				setMode,
				pen,
				setPen,
				eraser,
				setEraser,
				generalRef,
				words,
				setWords
			}}
		>
			{children}
		</CreateContext.Provider>
	);
};

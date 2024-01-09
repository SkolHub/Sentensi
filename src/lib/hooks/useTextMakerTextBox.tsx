import {
	Dispatch,
	MutableRefObject,
	SetStateAction,
	useCallback,
	useContext,
	useEffect
} from 'react';
import { fontSizes, TextBoxContext } from '@/lib/contexts/TextBoxContext';
import { MainGeneral } from '@/lib/logic/packages/generals/main.general';
import { symbols } from '@/lib/hooks/usePunctuation';

export const useTextMakerTextBox = (
	generalRef: MutableRefObject<MainGeneral>,
	updater: boolean,
	setUpdater: Dispatch<SetStateAction<boolean>>,
	selected: number,
	setSelected: Dispatch<SetStateAction<number>>,
	fontSize: number,
	canEdit: boolean
) => {
	const zoom = useContext(TextBoxContext)!;

	const wordClick = useCallback(
		(index: number) => {
			setSelected(index === selected ? -1 : index);
		},
		[selected]
	);

	const calcStyle = useCallback(
		(index: number, word: string) => ({
			fontSize: `${(fontSizes[fontSize - 1] / zoom) * 31}px`,
			paddingLeft:
				index === 0 || word[0] !== '\x80'
					? `${(fontSizes[fontSize - 1] / 2 / zoom) * 31}px`
					: '',
			color:
				selected === -1 || selected === index ? '#000000' : 'rgba(0,0,0,0.5)'
		}),
		[fontSize, zoom, selected]
	);

	useEffect(() => {
		const general = generalRef.current;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (!canEdit) return;

			const sel = selected === -1 ? general.answer.length - 1 : selected;

			if (e.key === 'Backspace' && general.answer.length) {
				if (symbols.includes(general.answer[sel].at(-1)!)) {
					general.answer[sel] = general.answer[sel].slice(0, -1);
				} else {
					general.answer.splice(sel, 1);

					setSelected(-1);
				}

				setUpdater(!updater);
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [updater, setUpdater, selected, setSelected, canEdit]);

	return {
		wordClick,
		calcStyle,
		zoom
	};
};

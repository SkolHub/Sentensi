import {
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect
} from 'react';
import { fontSizes, TextBoxContext } from '@/lib/contexts/TextBoxContext';
import { symbols } from '@/lib/hooks/usePunctuation';

export const useTextMakerTextBox = (
	updater: boolean,
	setUpdater: Dispatch<SetStateAction<boolean>>,
	selected: number,
	setSelected: Dispatch<SetStateAction<number>>,
	fontSize: number,
	canEdit: boolean,
	wordList: string[],
	setExpanded: Dispatch<SetStateAction<boolean>>
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
				word[0] !== '\x80'
					? `${(fontSizes[fontSize - 1] / 2 / zoom) * 22}px`
					: '0',
			color:
				selected === -1 || selected === index ? '#000000' : 'rgba(0,0,0,0.5)',
			lineHeight: '1'
		}),
		[fontSize, zoom, selected]
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!canEdit) return;

			const sel = selected === -1 ? wordList.length - 1 : selected;

			if (e.key === 'Backspace' && wordList.length) {
				if (symbols.includes(wordList[sel].at(-1)!)) {
					wordList[sel] = wordList[sel].slice(0, -1);
				} else {
					wordList.splice(sel, 1);

					setSelected(-1);
				}

				if (selected === -1) {
					setExpanded(true);
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

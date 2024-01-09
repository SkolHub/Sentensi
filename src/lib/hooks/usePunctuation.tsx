import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { MainGeneral } from '@/lib/logic/packages/generals/main.general';

export const symbols = ['.', '?', ';', ',', '!', ':', '"', "'", '-'];

export const usePunctuation = (
	generalRef: MutableRefObject<MainGeneral>,
	updater: boolean,
	setUpdater: Dispatch<SetStateAction<boolean>>,
	selected: number,
	setSelected: Dispatch<SetStateAction<number>>
) => {
	const general = generalRef.current;

	const handleGlueClick = () => {
		const sel = selected != -1 ? selected : general.answer.length - 1;

		if (general.answer.length && sel != 0) {
			const word = general.answer[sel];

			if (word[0] === '\x80') {
				general.answer[sel] = word.substring(1);
			} else {
				general.answer[sel] = '\x80' + word;
			}

			setUpdater(!updater);
			setSelected(-1);
		}
	};

	const handleCapitaliseClick = () => {
		const sel = selected != -1 ? selected : general.answer.length - 1;

		if (general.answer.length) {
			const word = general.answer[sel];
			const glued = +(word[0] === '\x80');

			const char = general.answer[sel][glued];

			if (char.toUpperCase() === char) {
				general.answer[sel] =
					(glued ? '\x80' : '') +
					char.toLowerCase() +
					word.substring(1 + glued);
			} else {
				general.answer[sel] =
					(glued ? '\x80' : '') +
					char.toUpperCase() +
					word.substring(1 + glued);
			}

			setUpdater(!updater);
			setSelected(-1);
		}
	};

	const handlePunctuationClick = (symbol: string) => {
		if (general.answer.length) {
			const sel = selected === -1 ? general.answer.length - 1 : selected;
			general.answer[sel] += symbol;

			setSelected(-1);

			setUpdater(!updater);
		}
	};

	return {
		handleGlueClick,
		handlePunctuationClick,
		handleCapitaliseClick
	};
};

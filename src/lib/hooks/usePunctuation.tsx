import { Dispatch, SetStateAction } from 'react';

export const symbols = ['.', '?', ';', ',', '!', ':', '"', "'", '-'];

export const usePunctuation = (
	wordList: string[],
	updater: boolean,
	setUpdater: Dispatch<SetStateAction<boolean>>,
	selected: number,
	setSelected: Dispatch<SetStateAction<number>>
) => {
	const handleGlueClick = () => {
		const sel = selected != -1 ? selected : wordList.length - 1;

		if (wordList.length && sel != 0) {
			const word = wordList[sel];

			if (word[0] === '\x80') {
				wordList[sel] = word.substring(1);
			} else {
				wordList[sel] = '\x80' + word;
			}

			setUpdater(!updater);
			setSelected(-1);
		}
	};

	const handleCapitaliseClick = () => {
		const sel = selected != -1 ? selected : wordList.length - 1;

		if (wordList.length) {
			const word = wordList[sel];
			const glued = +(word[0] === '\x80');

			const char = wordList[sel][glued];

			if (char.toUpperCase() === char) {
				wordList[sel] =
					(glued ? '\x80' : '') +
					char.toLowerCase() +
					word.substring(1 + glued);
			} else {
				wordList[sel] =
					(glued ? '\x80' : '') +
					char.toUpperCase() +
					word.substring(1 + glued);
			}

			setUpdater(!updater);
			setSelected(-1);
		}
	};

	const handlePunctuationClick = (symbol: string) => {
		if (wordList.length) {
			const sel = selected === -1 ? wordList.length - 1 : selected;
			wordList[sel] += symbol;

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

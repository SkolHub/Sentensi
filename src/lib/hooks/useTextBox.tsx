'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';

const useTextBox = (words: string[], setWords: Dispatch<SetStateAction<string[]>>) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case ' ':
					if (words[words.length - 1] != '') {
						words.push('');
					}
					break;

				case 'Backspace':
					if (words[words.length - 1].length) {
						words[words.length - 1] = words[words.length - 1].slice(0, -1);
					} else if (words.length > 1) {
						words = words.slice(0, -1);
					}
					break;

				default:
					if (e.key.length === 1) {
						words[words.length - 1] += e.key;
					}
			}

			setWords([...words]);
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [words, setWords]);
};

export default useTextBox;

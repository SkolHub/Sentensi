'use client';

import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';

const useCanvasMakerTextBox = (
	words: string[],
	setWords: Dispatch<SetStateAction<string[]>>
) => {
	const { generalRef, canvasTextBox, setCanvasTextBox, pen, isSaveOpen } =
		useContext(CreateContext)!;

	const handleTextBoxWordClick = (index: number, _e: MouseEvent) => {
		const general = generalRef.current;

		if (!pen) {
			let width = 0;

			for (const letter of canvasTextBox[index]) {
				width += general.commonPkg.measure(letter, 64).width;
			}

			general.words.push({
				start: {
					x: 0,
					y: 0
				},
				control: {
					x: width / 2,
					y: 0
				},
				end: {
					x: width,
					y: 0
				},
				color: {
					top: '#000000',
					bottom: '#000000'
				},
				content: canvasTextBox[index],
				fontSize: 64
			});

			general.action = 'move';

			general.wordsPkg.wordHandlers.initMove(
				general.words[general.words.length - 1],
				{ x: 0, y: 0 }
			);

			if (canvasTextBox.length === 1) {
				setCanvasTextBox(['']);
			} else {
				canvasTextBox.splice(index, 1);
				setCanvasTextBox([...canvasTextBox]);
			}
		}
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isSaveOpen) return;

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
	}, [words, setWords, isSaveOpen]);

	return handleTextBoxWordClick;
};

export default useCanvasMakerTextBox;

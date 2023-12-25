import { useContext } from 'react';
import { CreateContext } from './CreateContext';
import useTextBox from '../../../hooks/useTextBox';

const TextBox = () => {
	const { words, setWords, generalRef } = useContext(CreateContext)!;

	useTextBox(words, setWords);

	const handleTextBoxWordClick = (index: number, _e: MouseEvent) => {
		const general = generalRef.current;

		let width = 0;

		for (const letter of words[index]) {
			width += general.common!.measure(letter, 64).width;
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
			content: words[index],
			fontSize: 64
		});

		general.action = 'move';

		general.details = {
			point: { x: 0, y: 0 },
			target: general.words[general.words.length - 1]
		};

		if (words.length === 1) {
			setWords(['']);
		} else {
			words.splice(index, 1);
			setWords([...words]);
		}
	};

	const fontSize = 3;

	const selected = -1;
	return (
		<div className='section text-box'>
			{words.map((word: any, index: any) => (
				<span
					onMouseDown={(e: any) => {
						handleTextBoxWordClick(index, e);
					}}
					style={{
						fontSize: `${fontSize}vw`,
						paddingRight: `${fontSize / 2}vw`,
						color: selected === -1 || selected === index ? '#000000' : '#0F0F0F'
					}}
					key={index}
				>
					{word}
				</span>
			))}
		</div>
	);
};

export default TextBox;

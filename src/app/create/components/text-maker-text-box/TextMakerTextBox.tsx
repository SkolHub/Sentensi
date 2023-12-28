import useTextMakerTextBox from '@/app/create/components/text-maker-text-box/useTextMakerTextBox';
import { useContext } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';

const TextMakerTextBox = () => {
	const { fontSize, generalRef, selected, setSelected } =
		useContext(CreateContext)!;

	const general = generalRef.current;

	useTextMakerTextBox();

	return (
		<div className="section text-box">
			{general.answer.map((word: string, index: number) => (
				<span
					onMouseDown={() => {
						if (index === selected) {
							setSelected(-1);
						} else {
							setSelected(index);
						}
					}}
					style={{
						fontSize: `${fontSize}vw`,
						paddingLeft:
							index === 0 || word[0] !== '\x80' ? `${fontSize / 2}vw` : '',
						color:
							selected === -1 || selected === index
								? '#000000'
								: 'rgba(0,0,0,0.5)'
					}}
					key={index}
				>
					{word.replace('\x80', '')}
				</span>
			))}
		</div>
	);
};

export default TextMakerTextBox;
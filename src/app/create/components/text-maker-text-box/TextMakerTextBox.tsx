import useTextMakerTextBox from '@/app/create/components/text-maker-text-box/useTextMakerTextBox';
import { useContext } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';

const TextMakerTextBox = () => {
	const { fontSize, generalRef, selected, setSelected } = useContext(CreateContext)!;

	const general = generalRef.current;

	useTextMakerTextBox();

	return <div className="section text-box">
		{general.answer.map((word: string, index: number) => (
			<span
				onMouseDown={() => {
					setSelected(index);
				}}
				style={{
					fontSize: `${fontSize}vw`,
					paddingRight: `${fontSize / 2}vw`,
					color: selected === -1 || selected === index ? '#000000' : 'rgba(0,0,0,0.5)',
				}}
				key={index}
			>
					{word}
				</span>
		))}
	</div>;
}

export default TextMakerTextBox;
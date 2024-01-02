import useTextMakerTextBox from '@/app/create/components/text-maker-text-box/useTextMakerTextBox';
import { useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import { fontSizes, TextBoxContext } from '@/lib/contexts/TextBoxContext';

const TextMakerTextBox = () => {
	const { fontSize, generalRef, selected, setSelected, updater } =
		useContext(CreateContext)!;

	const zoom = useContext(TextBoxContext)!;

	useTextMakerTextBox();

	return useMemo(
		() => (
			<div className="section text-box">
				{generalRef.current.answer.map((word: string, index: number) => (
					<span
						onMouseDown={() => {
							if (index === selected) {
								setSelected(-1);
							} else {
								setSelected(index);
							}
						}}
						style={{
							fontSize: `${(fontSizes[fontSize - 1] / zoom) * 31}px`,
							paddingLeft:
								index === 0 || word[0] !== '\x80'
									? `${(fontSizes[fontSize - 1] / 2 / zoom) * 31}px`
									: '',
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
		),
		[fontSize, selected, setSelected, updater, zoom]
	);
};

export default TextMakerTextBox;

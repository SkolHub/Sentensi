'use client';

import { useContext } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import useTextBox from '@/app/create/components/canvas-maker-text-box/useCanvasMakerTextBox';

const CanvasMakerTextBox = () => {
	const { canvasTextBox, setCanvasTextBox, fontSize } = useContext(CreateContext)!;

	const handleTextBoxWordClick = useTextBox(canvasTextBox, setCanvasTextBox);

	const style = {
		fontSize: `${fontSize}vw`,
		paddingRight: `${fontSize / 2}vw`,
		color: '#000000',
	};

	return (
		<div className="section text-box">
			{canvasTextBox.map((word: string, index: number) => (
				<span
					onMouseDown={(e: any) => {
						handleTextBoxWordClick(index, e);
					}}
					style={style}
					key={index}
				>
					{word}
				</span>
			))}
		</div>
	);
};

export default CanvasMakerTextBox;

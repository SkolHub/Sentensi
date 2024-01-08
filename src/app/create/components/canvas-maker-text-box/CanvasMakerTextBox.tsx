import { useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import useTextBox from '@/app/create/components/canvas-maker-text-box/useCanvasMakerTextBox';
import { fontSizes, TextBoxContext } from '@/lib/contexts/TextBoxContext';

const CanvasMakerTextBox = () => {
	const { canvasTextBox, setCanvasTextBox, fontSize, pen } =
		useContext(CreateContext)!;

	const handleTextBoxWordClick = useTextBox(canvasTextBox, setCanvasTextBox);

	const zoom = useContext(TextBoxContext)!;

	const style = useMemo(
		() => ({
			fontSize: `${(fontSizes[fontSize - 1] / zoom) * 31}px`,
			paddingRight: `${(fontSizes[fontSize - 1] / 2 / zoom) * 31}px`,
			color: '#000000'
		}),
		[fontSize, zoom]
	);

	return useMemo(
		() => (
			<div className='section text-box'>
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
		),
		[canvasTextBox, style, pen]
	);
};

export default CanvasMakerTextBox;

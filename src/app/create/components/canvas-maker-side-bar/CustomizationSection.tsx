import { useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import {
	Eraser,
	Pen,
	Resize,
	Stretch
} from '../../../../../public/icons/icons-module';
import { extendTheme, Slider, ThemeProvider } from '@mui/joy';
import Button from '@/components/Button';

const muiTheme = extendTheme({
	components: {
		JoySlider: {
			styleOverrides: {
				track: {
					background: '#004B88'
				},
				thumb: {
					'::before': {
						borderColor: '#004B88'
					}
				}
			}
		}
	}
});

const CustomizationSection = () => {
	const {
		setSizingMode,
		sizingMode,
		pen,
		setPen,
		eraser,
		setEraser,
		setFontSize,
		fontSize,
		lineWidth,
		setLineWidth
	} = useContext(CreateContext)!;

	const handleStretchClick = () => {
		setSizingMode(sizingMode === 'stretch' ? 'scale' : 'stretch');
	};

	const title = sizingMode === 'stretch' ? 'Stretch' : 'Resize';
	const logo = sizingMode === 'stretch' ? Stretch : Resize;

	const handlePenClick = () => {
		setPen(!pen);
	};

	const handleEraserClick = () => {
		setEraser(!eraser);
	};

	const handleFontSize = (
		_event: Event,
		value: number | number[],
		_activeThumb: number
	) => {
		setFontSize(value as number);
	};

	const handleLineWidth = (
		_event: Event,
		value: number | number[],
		_activeThumb: number
	) => {
		setLineWidth(value as number);
	};

	return useMemo(
		() => (
			<div className='section grow'>
				<Button className='grow' onClick={handleStretchClick} title={title} Logo={logo} active />
				<label  className='grow select-none'>
					{pen ? 'Line width' : 'Font size'}
				</label>
				<ThemeProvider theme={muiTheme}>
					{pen ? (
						<Slider
							className='grow'
							onChange={handleLineWidth}
							value={lineWidth}
							min={2}
							max={30}
							step={1}
							valueLabelDisplay="auto"
						/>
					) : (
						<Slider
							className='grow'
							onChange={handleFontSize}
							value={fontSize}
							min={1}
							max={4}
							step={1}
							valueLabelDisplay="auto"
							marks
						/>
					)}
				</ThemeProvider>
				<div className="flex gap-4 flex-col drawAndErase max-[900px]:flex-row">
					<Button
						className='grow'
						onClick={handlePenClick}
						title={'Pen'}
						Logo={Pen}
						active={pen}
					/>
					<Button
						className='grow'
						onClick={handleEraserClick}
						title={'Eraser'}
						Logo={Eraser}
						active={eraser}
					/>
				</div>
			</div>
		),
		[pen, eraser, fontSize, lineWidth]
	);
};

export default CustomizationSection;

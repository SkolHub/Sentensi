import { useContext } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import {
	Eraser,
	Pen,
	Resize,
	Stretch
} from '../../../../../public/icons/icons-module';
import Button from '@/components/Button/Button';
import { extendTheme, Slider, ThemeProvider } from '@mui/joy';

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
		setFontSize
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

	const handleSlider = (
		_event: Event,
		value: number | number[],
		_activeThumb: number
	) => {
		setFontSize(value as number);
	};

	return (
		<div className="section">
			<Button onClick={handleStretchClick} title={title} Logo={logo} active />
			<label style={{ userSelect: 'none' }}>Font size</label>
			<ThemeProvider theme={muiTheme}>
				<Slider
					onChange={handleSlider}
					defaultValue={3}
					min={1}
					max={4}
					step={1}
					valueLabelDisplay="auto"
					marks
				/>
			</ThemeProvider>
			<Button onClick={handlePenClick} title={'Pen'} Logo={Pen} active={pen} />
			<Button
				onClick={handleEraserClick}
				title={'Eraser'}
				Logo={Eraser}
				active={eraser}
			/>
		</div>
	);
};

export default CustomizationSection;

import CustomSwitch from '@/components/Switch';
import { useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import ColorPicker from '@/app/create/components/canvas-maker-side-bar/ColorPicker';

const ColorSection = () => {
	const { doubleColor, setDoubleColor } = useContext(CreateContext)!;

	return useMemo(
		() => (
			<div className='section grow'>
				<ColorPicker />
				<div className='flex items-center justify-between'>
					<label className='select-none'>Double color</label>
					<CustomSwitch checked={doubleColor} setChecked={setDoubleColor} />
				</div>
			</div>
		),
		[doubleColor]
	);
};

export default ColorSection;

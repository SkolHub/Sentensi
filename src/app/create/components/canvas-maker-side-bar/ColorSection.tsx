import CustomSwitch from '@/components/Switch';
import { useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import ColorPicker from '@/app/create/components/canvas-maker-side-bar/ColorPicker';
import SidebarSection from '@/components/SidebarSection';

const ColorSection = () => {
	const { doubleColor, setDoubleColor } = useContext(CreateContext)!;

	return useMemo(
		() => (
			<SidebarSection>
				<ColorPicker />
				<div className='flex items-center justify-between'>
					<label className='select-none height-3:text-[.5rem]'>Double color</label>
					<CustomSwitch checked={doubleColor} setChecked={setDoubleColor} />
				</div>
			</SidebarSection>
		),
		[doubleColor]
	);
};

export default ColorSection;

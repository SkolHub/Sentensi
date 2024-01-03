import styles from './canvas-maker-side-bar.module.scss';
import CustomSwitch from '@/components/Switch';
import ColorPicker from '@/app/create/components/canvas-maker-side-bar/color-picker/ColorPicker';
import { useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';

const ColorSection = () => {
	const { doubleColor, setDoubleColor } = useContext(CreateContext)!;

	return useMemo(
		() => (
			<div className={`section ${styles.colorSection}`}>
				<ColorPicker />
				<div className={styles.doubleColor}>
					<label style={{ userSelect: 'none' }}>Double color</label>
					<CustomSwitch checked={doubleColor} setChecked={setDoubleColor} />
				</div>
			</div>
		),
		[doubleColor]
	);
};

export default ColorSection;

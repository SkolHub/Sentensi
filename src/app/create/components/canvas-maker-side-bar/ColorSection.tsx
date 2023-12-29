import ColorPicker from '@/components/ColorPicker/ColorPicker';
import styles from '../../page.module.scss';
import CustomSwitch from '@/components/Switch';

const ColorSection = () => {
	return (
		<div className="section">
			<ColorPicker />
			<div className={styles.doubleColor}>
				<label style={{ userSelect: 'none' }}>Double color</label>
				<CustomSwitch />
			</div>
		</div>
	);
};

export default ColorSection;
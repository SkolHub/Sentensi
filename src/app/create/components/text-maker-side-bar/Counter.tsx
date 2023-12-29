import Minus from '../../../../../public/icons/Minus.svg';
import Plus from '../../../../../public/icons/Plus.svg';
import styles from '../../page.module.scss';

const Counter = (props: {
	onPlus: () => void;
	onMinus: () => void;
	onChange: (e: any) => void;
	onBlur: (e: any) => void;
	value: number;
}) => {
	const { onPlus, onMinus, onChange, onBlur, value } = props;

	return (
		<div className={styles.counter}>
			<div onClick={onMinus} className={styles.hoverLeft}>
				<Minus />
			</div>
			<div className={styles.bordered}>
				<input
					type="number"
					value={value}
					onChange={onChange}
					onBlur={onBlur}
				/>
			</div>
			<div onClick={onPlus} className={styles.hoverRight}>
				<Plus />
			</div>
		</div>
	);
};

export default Counter;

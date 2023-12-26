import styles from './simple-button.module.scss';

const SimpleButton = ({ symbol }: { symbol: string }) => {
	return (
		<div className={styles.outerSimpleButton}>
			<div className={styles.simpleButton}>{symbol}</div>
		</div>
	);
};

export default SimpleButton;

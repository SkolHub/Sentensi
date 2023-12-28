import styles from './simple-button.module.scss';

const SimpleButton = ({ symbol, onClick }: { symbol: string, onClick: () => void }) => {
	return (
		<div onClick={onClick} className={styles.outerSimpleButton}>
			<div className={styles.simpleButton}>{symbol}</div>
		</div>
	);
};

export default SimpleButton;

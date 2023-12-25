import './SimpleButton.scss';

const SimpleButton = ({ symbol }: { symbol: string }) => {
	return (
		<div className='outer-simple-button'>
			<div className='simple-button'>{symbol}</div>
		</div>
	);
};

export default SimpleButton;

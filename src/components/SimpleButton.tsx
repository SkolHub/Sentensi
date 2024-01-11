const SimpleButton = ({ symbol, onClick }: { symbol: string, onClick: () => void }) => {
	return (
		<div onClick={onClick} className="flex items-center justify-center">
			<div
				className='simple-button height-2:w-8 height-2:h-8 bg-[#003e70] cursor-pointer flex items-center justify-center [background:#004B88] border text-white text-[1.3rem] w-12 h-12 transition-all duration-[0.3s] ease-[ease-in-out] select-none p-[0.3rem] rounded-[10rem] border-solid border-[rgba(255,255,255,0.50)]'>{symbol}</div>
		</div>
	);
};

export default SimpleButton;

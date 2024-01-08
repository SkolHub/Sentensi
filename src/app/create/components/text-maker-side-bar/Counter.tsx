import Minus from '../../../../../public/icons/Minus.svg';
import Plus from '../../../../../public/icons/Plus.svg';

const Counter = (props: {
	onPlus: () => void;
	onMinus: () => void;
	onChange: (e: any) => void;
	onBlur: (e: any) => void;
	value: number;
}) => {
	const { onPlus, onMinus, onChange, onBlur, value } = props;

	return (
		<div
			className="flex items-center border justify-between rounded-2xl border-solid border-[rgba(61,71,86,0.2)] bg-[rgba(255,255,255,0.7)]">
			<div onClick={onMinus}
					 className="w-0 grow flex justify-center h-full items-center transition-[background-color] duration-300 rounded-[1rem_0_0_1rem] cursor-pointer hover:bg-[rgba(61,71,86,0.15)]">
				<Minus />
			</div>
			<div
				className="w-0 grow flex justify-center mx-0 my-3 border-x-[rgba(61,71,86,0.5)] border-l border-solid border-r">
				<input
					className="text-2xl w-full outline-none text-center caret-[rgba(61,71,86,0.5)] select-none border-none"
					type="number"
					value={value}
					onChange={onChange}
					onBlur={onBlur}
				/>
			</div>
			<div onClick={onPlus}
					 className="w-0 grow flex justify-center h-full items-center transition-[background-color] duration-300 rounded-[0_1rem_1rem_0] cursor-pointer hover:bg-[rgba(61,71,86,0.15)]">
				<Plus />
			</div>
		</div>
	);
};

export default Counter;

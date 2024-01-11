import { ReactNode } from 'react';

const Button = (props: {
	title: string;
	active: boolean;
	Logo: any;
	color?: string;
	onClick?: () => void;
	children?: ReactNode;
	className?: string;
}) => {
	const { title, active, Logo, color, onClick, className } = props;

	return (
		<div
			onClick={onClick}
			className={`button grow cursor-pointer flex items-center gap-4 border duration-[0.3s] transition-all ease-[ease-in-out] px-4 py-2 height-2:px-2 height-2:py-1 rounded-2xl height-2:rounded-xl border-solid height-1:gap-0 height-1:justify-center ${
				className ?? ''
			} ${
				active
					? ' bg-[#004B88] shadow-[0_0_0.625rem_0_rgba(0,0,0,0.25)] border-[#004B88] hover:bg-[#003e70]'
					: 'bg-[#FFFFFF] border-[rgb(61,71,86)] hover:bg-[#e8e8e8]'
			}`}
		>
			<Logo className={`height-2:w-6 height-2:h-6 ${active ? '' : 'fill-[#3D4756] stroke-[#3D4756]'}`} />
			<label
				className={`select-none cursor-pointer height-1:hidden ${
					active ? 'text-white' : ''
				} ${color ? `text-[${color}]` : ''}`}
			>
				{title}
			</label>
		</div>
	);
};

export default Button;

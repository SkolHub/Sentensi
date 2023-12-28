import styles from './button.module.scss';
import { ReactNode } from 'react';

const Button = (props: {
	title: string;
	active: boolean;
	Logo: any;
	color?: string;
	onClick?: () => void;
	children?: ReactNode;
}) => {
	const { title, active, Logo, color, onClick } = props;

	return (
		<div
			onClick={onClick}
			className={`${styles.button} ${active ? styles.active : styles.inactive}`}
		>
			<Logo />
			<label
				style={{
					color
				}}
			>
				{title}
			</label>
		</div>
	);
};

export default Button;

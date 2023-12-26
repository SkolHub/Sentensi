import { FunctionComponent, SVGProps } from 'react';
import styles from './button.module.scss';

const Button = (props: {
	title: string;
	Logo: FunctionComponent<SVGProps<SVGSVGElement>>;
	active: boolean;
	color?: string;
	onClick?: () => void;
}) => {
	const { title, Logo, active, color, onClick } = props;

	return (
		<div onClick={onClick} className={`${styles.button} ${active ? styles.active : styles.inactive}`}>
			<Logo style={{
				fill: color,
				stroke: color
			}} />
			<label style={{
				color
			}}>{title}</label>
		</div>
	);
};

export default Button;

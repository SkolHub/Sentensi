import { FunctionComponent, SVGProps } from 'react';

const Button = (props: { title: string; Logo: FunctionComponent<SVGProps<SVGSVGElement>> }) => {
	const { title, Logo } = props;

	return (
		<div className='button'>
			<Logo />
			<label>{title}</label>
		</div>
	);
};

export default Button;

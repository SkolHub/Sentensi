import { ReactNode } from 'react';

export default ({
	children,
	className
}: {
	children: ReactNode;
	className?: string;
}) => {
	return <div className={`section w-full flex flex-col box-border gap-4 p-4 grow height-2:gap-2 height-2:p-2 ${className ?? ''}`}>{children}</div>;
};

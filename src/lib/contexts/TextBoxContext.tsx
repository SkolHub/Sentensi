'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

export const fontSizes = [1, 4 / 3, 2, 4];

export const TextBoxContext = createContext<number | undefined>(undefined);

export const TextBoxContextProvider = ({
	children
}: {
	children: ReactNode;
}) => {
	const [zoom, setZoom] = useState<number>(1);

	useEffect(() => {
		const handleResize = () => {
			setZoom(window.devicePixelRatio);
		};

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<TextBoxContext.Provider value={zoom}>{children}</TextBoxContext.Provider>
	);
};

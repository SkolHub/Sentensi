'use client';

import { useContext, useEffect, useRef } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';
import preventDefault from '@/lib/other/prevent-default';

export default () => {
	const { generalRef, setUpdater, updater, status } = useContext(PlayContext)!;

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current!;
		const general = generalRef.current;

		general.canvas = canvas;

		const handleMouseUp = (e: MouseEvent) => {
			if (e.button || status !== 'solve' || general.type === 'r|w') return;

			const point = general.getClick(e);

			const res = general.wordsPkg.getClickedWord(point);

			if (res) {
				general.playerAnswer.push(res.word.content);
			}

			setUpdater(!updater);
		};

		const handleResize = () => {
			const zoom = window.devicePixelRatio;

			canvas.width = canvas.getBoundingClientRect().width * zoom;
			canvas.height = canvas.getBoundingClientRect().height * zoom;

			general.render();
			general.render();
			general.render();
		};

		handleResize();

		window.addEventListener('mouseup', handleMouseUp);

		canvas.addEventListener('contextmenu', preventDefault);
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);

			canvas.removeEventListener('contextmenu', preventDefault);
			window.removeEventListener('resize', handleResize);
		};
	}, [updater]);

	return canvasRef;
};

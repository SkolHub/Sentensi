'use client';

import { useContext, useEffect, useRef } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';
import preventDefault from '@/lib/other/prevent-default';

export default () => {
	const {
		generalRef,
		setUpdater,
		updater,
		status,
		selected,
		setSelected,
		setExpanded
	} = useContext(PlayContext)!;

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
				if (selected !== -1) {
					general.answer.splice(selected, 0, res.word.content);
					setSelected(-1);
				} else {
					general.playerAnswer.push(res.word.content);
				}
			}

			setExpanded(true);
			setUpdater(!updater);
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (status !== 'solve' || general.type === 'r|w') return;

			const point = general.getClick(e);

			const res = general.wordsPkg.getClickedWord(point);

			if (res) {
				canvas.style.cursor = 'cell';
			} else {
				canvas.style.cursor = '';
			}
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
		canvas.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);

			canvas.removeEventListener('contextmenu', preventDefault);
			canvas.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('resize', handleResize);
		};
	}, [updater, selected]);

	return canvasRef;
};

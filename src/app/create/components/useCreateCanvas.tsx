'use client';

import { useContext, useEffect, useRef } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';

const useCreateCanvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const {
		generalRef,
		sizingMode,
		color,
		doubleColor,
		mode,
		setUpdater,
		updater,
		pen,
		eraser
	} = useContext(CreateContext)!;

	useEffect(() => {
		const canvas = canvasRef.current!;
		const general = generalRef.current;

		general.canvas = canvas;

		general.toolsPkg.reset();

		const handleMouseDown = (e: MouseEvent) => {
			const point = general.getClick(e);

			if (mode === 'canvas') {
				if (eraser) {
					general.drawPkg.checkErase(point);
				} else if (pen) {
					general.drawPkg.checkDraw(point);
				} else {
					let ok = general.toolsPkg.checkTools(point);

					if (!ok) {
						ok = general.wordsPkg.checkWords(point);
					}

					if (!ok) {
						general.toolsPkg.selectArea(point);
					}
				}

				general.render();
			} else {
				const res = general.wordsPkg.getClickedWord(point);

				if (res) {
					general.answer.push(res.word.content);
				}

				setUpdater(!updater);
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			const point = general.getClick(e);

			if (mode !== 'canvas') return;

			if (eraser) {
				if (pen) {
					general.drawPkg.handleErase(point);
				} else {
					general.wordsPkg.handleErase(point);
				}
			}

			if (pen) {
				general.drawPkg.handleDraw(point);
			} else {
				let ok = general.wordsPkg.handleWords(point);

				if (!ok) {
					general.toolsPkg.handleTools(point);
				}
			}

			general.render();
		};

		const handleMouseUp = (e: MouseEvent) => {
			const point = general.getClick(e);

			if (mode !== 'canvas' || !general.action) return;

			if (general.action === 'draw') {
				general.drawPkg.finishDraw(point);
			} else {
				general.toolsPkg.finishTools();
			}

			general.action = null;

			general.render();
		};

		const handleResize = () => {
			canvas.width = canvas.getBoundingClientRect().width;
			canvas.height = canvas.getBoundingClientRect().height;

			general.render();
		};

		handleResize();

		canvas.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);

		window.addEventListener('resize', handleResize);

		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);

			window.addEventListener('resize', handleResize);
		};
	}, [color, doubleColor, sizingMode, mode, setUpdater, updater, pen, eraser]);

	return {
		canvasRef,
		generalRef
	};
};

export default useCreateCanvas;

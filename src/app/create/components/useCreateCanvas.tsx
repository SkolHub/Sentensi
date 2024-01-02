'use client';

import { useContext, useEffect, useRef } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import { Point } from '@/lib/logic/models';

const preventDefault = (e: Event) => {
	e.preventDefault();
}

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

		general.wordsPkg.sizingMode = sizingMode;

		const mouseDownCanvas = (point: Point) => {
			if (eraser) {
				general.drawPkg.checkErase(point);
				return;
			}

			if (pen) {
				general.drawPkg.checkDraw(point);
				return;
			}

			if (general.toolsPkg.checkTools(point)) {
				return;
			}

			if (general.wordsPkg.checkWords(point)) {
				return;
			}

			general.toolsPkg.selectArea(point);
		}

		const handleMouseDown = (e: MouseEvent) => {
			if (e.button) return;

			const point = general.getClick(e);

			if (mode === 'canvas') {
				mouseDownCanvas(point);

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
			if (e.button || mode !== 'canvas') return;

			const point = general.getClick(e);

			if (eraser) {
				if (pen) {
					general.drawPkg.handleErase(point);
				} else {
					general.wordsPkg.handleErase(point);
				}
			} else if (pen) {
				general.drawPkg.handleDraw(point);
			} else {
				if (!general.wordsPkg.handleWords(point)) {
					general.toolsPkg.handleTools(point);
				}
			}

			general.render();
		};

		const handleMouseUp = (e: MouseEvent) => {
			if (e.button || mode !== 'canvas' || !general.action) return;

			const point = general.getClick(e);

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

		canvas.addEventListener('contextmenu', preventDefault);
		window.addEventListener('resize', handleResize);

		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);

			canvas.removeEventListener('contextmenu', preventDefault);
			window.removeEventListener('resize', handleResize);
		};
	}, [color, doubleColor, sizingMode, mode, setUpdater, updater, pen, eraser]);

	return {
		canvasRef,
		generalRef
	};
};

export default useCreateCanvas;

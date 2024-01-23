'use client';

import { useContext, useEffect, useRef } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import { Point } from '@/lib/logic/models';
import preventDefault from '@/lib/other/prevent-default';

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
		eraser,
		lineWidth,
		selected,
		setSelected,
		expanded
	} = useContext(CreateContext)!;

	useEffect(() => {
		const canvas = canvasRef.current!;
		const general = generalRef.current;

		general.canvas = canvas;
		general.color = color;
		general.wordsPkg.doubleColor = doubleColor;
		general.drawPkg.lineWidth = lineWidth;

		general.toolsPkg.reset();
		general.render();

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

			if (general.toolsPkg.checkTools(point)) return;

			if (general.wordsPkg.checkWords(point)) return;

			general.toolsPkg.selectArea(point);
		};

		const handleMouseDown = (e: MouseEvent) => {
			if (e.button) return;

			const point = general.getClick(e);

			if (mode === 'canvas') {
				mouseDownCanvas(point);

				general.render();
			} else {
				const res = general.wordsPkg.getClickedWord(point);

				if (res) {
					if (selected !== -1) {
						general.answer.splice(selected, 0, res.word.content);
						setSelected(-1);
					} else {
						general.answer.push(res.word.content);
					}
				}

				setUpdater(!updater);
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (e.button) return;

			const point = general.getClick(e);

			if (mode === 'text') {
				const res = general.wordsPkg.getClickedWord(point);

				if (res) {
					canvas.style.cursor = 'cell';
				} else {
					canvas.style.cursor = '';
				}
				return;
			}

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

			if (general.action !== 'color') {
				general.action = null;
			}

			general.render();
		};

		const handleResize = () => {
			const zoom = window.devicePixelRatio;

			canvas.width = canvas.getBoundingClientRect().width * zoom;
			canvas.height = canvas.getBoundingClientRect().height * zoom;

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
	}, [
		color,
		doubleColor,
		sizingMode,
		mode,
		updater,
		pen,
		eraser,
		lineWidth,
		selected,
		expanded
	]);

	return canvasRef;
};

export default useCreateCanvas;

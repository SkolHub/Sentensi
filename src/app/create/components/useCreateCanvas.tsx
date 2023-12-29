'use client';

import { useContext, useEffect, useRef } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import { Common } from '@/lib/logic/packages/common/common';
import { Tools } from '@/lib/logic/packages/tools/tools';
import { Words } from '@/lib/logic/packages/words/words';
import { Draw } from '@/lib/logic/packages/drawing/draw';

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

		const common = new Common(canvas, general);
		const tools = new Tools(canvas, general);
		const words = new Words(canvas, general, sizingMode);
		const draw = new Draw(canvas, general);

		general.common = common;

		const render = () => {
			common.clear();

			draw.render();
			words.render();
			tools.render();
		};

		general.render = render;

		const handleMouseDown = (e: MouseEvent) => {
			const point = common.getClick(e);

			if (mode === 'canvas') {
				if (eraser) {
					draw.checkErase(point);
				} else if (pen) {
					draw.checkDraw(point);
				} else {
					let ok = tools.checkTools(point);

					if (!ok) {
						ok = words.checkWords(point);
					}

					if (!ok) {
						tools.selectArea(point);
					}
				}

				render();
			} else {
				const res = words.getClickedWord(point);

				if (res) {
					general.answer.push(res.word.content);
				}

				setUpdater(!updater);
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			const point = common.getClick(e);

			if (mode !== 'canvas') return;

			if (eraser) {
				if (pen) {
					draw.handleErase(point);
				} else {
					words.handleErase(point);
				}
			}

			if (pen) {
				draw.handleDraw(point);
			} else {
				let ok = words.handleWords(point);

				if (!ok) {
					tools.handleTools(point);
				}
			}

			render();
		};

		const handleMouseUp = (e: MouseEvent) => {
			const point = common.getClick(e);

			if (mode !== 'canvas' || !general.action) return;

			if (general.action === 'draw') {
				draw.finishDraw(point);
			} else {
				tools.finishTools();
			}

			general.action = null;

			render();
		};

		const handleResize = () => {
			canvas.width = canvas.getBoundingClientRect().width;
			canvas.height = canvas.getBoundingClientRect().height;

			render();
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

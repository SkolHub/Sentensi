'use client';

import { useContext, useEffect, useRef } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import { Common } from '@/lib/logic/packages/common/common';
import { Tools } from '@/lib/logic/packages/tools/tools';
import { Words } from '@/lib/logic/packages/words/words';

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
	} = useContext(CreateContext)!;

	useEffect(() => {
		const canvas = canvasRef.current!;
		const general = generalRef.current;

		const common = new Common(canvas, general);
		const tools = new Tools(canvas, general);
		const words = new Words(canvas, general, sizingMode);

		general.common = common;

		const render = () => {
			common.clear();

			words.render();
			tools.render();
		};

		general.render = render;

		const handleMouseDown = (e: MouseEvent) => {
			const point = common.getClick(e);

			if (mode === 'canvas') {
				let ok = tools.checkTools(point);

				if (!ok) {
					ok = words.checkWords(point);
				}

				if (!ok) {
					tools.selectArea(point);
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

			if (mode === 'canvas') {
				let ok = words.handleWords(point);

				if (!ok) {
					tools.handleTools(point);
				}

				render();
			}
		};

		const handleMouseUp = () => {
			if (mode === 'canvas') {
				tools.finishTools();

				general.action = null;

				render();
			}
		};

		const handleResize = () => {
			canvas.width = canvas.getBoundingClientRect().width;
			canvas.height = canvas.getBoundingClientRect().height;

			render();
		};

		handleResize();

		canvas.addEventListener('mousedown', handleMouseDown);
		canvas.addEventListener('mousemove', handleMouseMove);
		canvas.addEventListener('mouseup', handleMouseUp);

		window.addEventListener('resize', handleResize);

		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown);
			canvas.removeEventListener('mousemove', handleMouseMove);
			canvas.removeEventListener('mouseup', handleMouseUp);

			window.addEventListener('resize', handleResize);
		};
	}, [color, doubleColor, sizingMode, mode, setUpdater, updater]);

	return {
		canvasRef,
		generalRef,
	};
};

export default useCreateCanvas;

import { MutableRefObject, useEffect, useRef } from 'react';
import { CreateGeneral } from '../logic/packages/generals/create-general';
import { Common } from '../logic/packages/common/common';
import { Tools } from '../logic/packages/tools/tools';
import { Words } from '../logic/packages/words/words';

const useCreateCanvas = (
	color: string,
	doubleColor: boolean,
	sizingMode: 'stretch' | 'scale',
	generalRef: MutableRefObject<CreateGeneral>
) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

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

			let ok = tools.checkTools(point);

			if (!ok) {
				ok = words.checkWords(point);
			}

			if (!ok) {
				tools.selectArea(point);
			}

			render();
		};

		const handleMouseMove = (e: MouseEvent) => {
			const point = common.getClick(e);

			let ok = words.handleWords(point);

			if (!ok) {
				tools.handleTools(point);
			}

			render();
		};

		const handleMouseUp = () => {
			tools.finishTools();

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
		canvas.addEventListener('mousemove', handleMouseMove);
		canvas.addEventListener('mouseup', handleMouseUp);

		window.addEventListener('resize', handleResize);

		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown);
			canvas.removeEventListener('mousemove', handleMouseMove);
			canvas.removeEventListener('mouseup', handleMouseUp);

			window.addEventListener('resize', handleResize);
		};
	}, [color, doubleColor, sizingMode]);

	return {
		canvasRef,
		generalRef
	};
};

export default useCreateCanvas;

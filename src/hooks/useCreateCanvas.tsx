import { MutableRefObject, useEffect, useRef } from 'react';
import { Tools } from '../logic/tools.ts';
import { Renderer } from '../logic/renderer.ts';
import { General } from '../logic/general.ts';
import {
	checkPointSide,
	contained,
	getMedium,
	getSlope,
	groupRotateAngles,
	groupRotateLengths,
	pyth,
	stretchAngle,
	stretchLength
} from '../logic/math.ts';
import {
	handleBend,
	handleGroupMove,
	handleGroupRotate,
	handleGroupScale,
	handleGroupSelect,
	handleMove,
	handleSelectBox,
	handleStretch
} from '../logic/word-handlers.ts';

const useCanvas = (
	color: string,
	doubleColor: boolean,
	sizingMode: string,
	generalRef: MutableRefObject<General>
) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current!;

		const general = generalRef.current;

		const tools = new Tools();
		const renderer = new Renderer(canvas);

		general.renderer = renderer;

		const getClick = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();

			return {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			};
		};

		const render = () => {
			renderer.render(general.words, tools);
		};

		const handleMouseDown = (e: MouseEvent) => {
			const point = getClick(e);

			if (contained(point, tools.scaleThumb.state.x - 10, tools.scaleThumb.state.y - 10, 20, 20)) {
				// Clicked on scale thumb
				general.action.type = 'groupScale';

				general.action.details = {
					x: tools.selectBox.state.x,
					y: tools.selectBox.state.y,
					angle: getSlope(
						{
							x: tools.selectBox.state.x,
							y: tools.selectBox.state.y
						},
						{
							x: tools.selectBox.state.x + tools.selectBox.state.width,
							y: tools.selectBox.state.y + tools.selectBox.state.height
						}
					),
					distance: pyth(
						{
							x: tools.selectBox.state.x,
							y: tools.selectBox.state.y
						},
						{
							x: tools.scaleThumb.state.x + tools.selectBox.state.width,
							y: tools.scaleThumb.state.y + tools.selectBox.state.height
						}
					),
					length: tools.scaleThumb.state.x + tools.selectBox.state.width,
					origins: general.action.details.targets!.map((word) => ({
						start: {
							x: word.start.x,
							y: word.start.y
						},
						control: {
							x: word.control.x,
							y: word.control.y
						},
						end: {
							x: word.end.x,
							y: word.end.y
						},
						fontSize: word.fontSize
					})),
					targets: general.action.details.targets
				};

				tools.scaleOrigin.state = { ...tools.selectBox.state };

				tools.rotationTrack.reset();
				tools.rotationThumb.reset();
				tools.selectBox.reset();

				return;
			}

			if (pyth(point, tools.rotationThumb.state) <= 10) {
				// Clicked on rotation thumb
				general.action.type = 'groupRotate';

				general.action.details = {
					x: tools.rotationTrack.state.x,
					y: tools.rotationTrack.state.y,
					angles: groupRotateAngles(general.action.details.targets!, tools.rotationTrack.state),
					lengths: groupRotateLengths(general.action.details.targets!, tools.rotationTrack.state),
					targets: general.action.details.targets
				};

				tools.selectBox.reset();
				tools.scaleThumb.reset();

				return;
			}

			if (
				contained(
					point,
					tools.selectBox.state.x,
					tools.selectBox.state.y,
					tools.selectBox.state.width,
					tools.selectBox.state.height
				)
			) {
				// Clicked inside select box
				general.action.type = 'groupMove';

				general.action.details.x = point.x;
				general.action.details.y = point.y;

				tools.selectBox.reset();
				tools.rotationTrack.reset();
				tools.rotationThumb.reset();
				tools.scaleThumb.reset();

				return;
			}

			tools.selectBox.reset();
			tools.rotationTrack.reset();
			tools.rotationThumb.reset();
			tools.scaleThumb.reset();

			for (let i = 0; i < general.words.length; i++) {
				for (let j = 0; j < general.words[i].letterBoxes!.length; j++) {
					if (
						checkPointSide(
							point,
							general.words[i].letterBoxes![j].A,
							general.words[i].letterBoxes![j].B
						) &&
						checkPointSide(
							point,
							general.words[i].letterBoxes![j].B,
							general.words[i].letterBoxes![j].C
						) &&
						checkPointSide(
							point,
							general.words[i].letterBoxes![j].C,
							general.words[i].letterBoxes![j].D
						) &&
						checkPointSide(
							point,
							general.words[i].letterBoxes![j].D,
							general.words[i].letterBoxes![j].A
						)
					) {
						if (general.action.type === 'color') {
							general.words[i].color = {
								top: general.action.details.color!,
								bottom: general.action.details.color!
							};

							render();

							return;
						}

						if (j === 0) {
							general.action.type = 'move';
							general.action.details = {
								x: point.x,
								y: point.y
							};
						} else if (j === general.words[i].content.length - 1) {
							general.action.type = 'stretch';
							general.action.details = {
								length: stretchLength(general.words[i]),
								angle: stretchAngle(general.words[i])
							};
						} else {
							general.action.type = 'bend';
						}

						general.action.details.target = general.words[i];

						return;
					}
				}
			}

			general.action.type = 'select';

			general.action.details = {
				x: point.x,
				y: point.y
			};

			tools.selectBox.state = {
				x: point.x,
				y: point.y,
				width: 0,
				height: 0
			};

			render();
		};

		const handleMouseMove = (e: MouseEvent) => {
			const { x, y } = getClick(e);

			switch (general.action.type) {
				case 'move':
					handleMove(general.action.details, x, y);
					break;

				case 'bend':
					handleBend(general.action.details, x, y);
					break;

				case 'stretch':
					handleStretch(
						general.action.details,
						x,
						y,
						sizingMode === 'scale',
						renderer.measure(
							general.action.details.target!.content,
							`${general.action.details.target!.fontSize}px Whiteboard`
						).width
					);

					break;

				case 'select':
					tools.selectBox.state = handleSelectBox(general.action.details, x, y);

					break;

				case 'groupMove':
					handleGroupMove(general.action.details, x, y);

					break;

				case 'groupRotate':
					tools.rotationThumb.state = handleGroupRotate(general.action.details, x, y);

					break;

				case 'groupScale':
					const pos = handleGroupScale(general.action.details, x);

					if (pos) {
						tools.scaleThumb.state = pos;
					}

					break;

				case 'color':
					break;
			}

			render();
		};

		const handleMouseUp = () => {
			switch (general.action.type) {
				case 'select':
					const selectedWords = handleGroupSelect(general.words, tools.selectBox.state);

					if (selectedWords.length) {
						general.action.details.targets = selectedWords;

						tools.rotationTrack.state = getMedium(selectedWords);

						tools.rotationThumb.state = {
							x: tools.rotationTrack.state.x,
							y: tools.rotationTrack.state.y - 60
						};

						tools.scaleThumb.state = {
							x: tools.selectBox.state.x + tools.selectBox.state.width,
							y: tools.selectBox.state.y + tools.selectBox.state.height
						};
					} else {
						tools.selectBox.reset();
						tools.rotationTrack.reset();
						tools.rotationThumb.reset();
						tools.scaleThumb.reset();
					}

					break;

				case 'groupRotate':
					tools.rotationTrack.reset();
					tools.rotationThumb.reset();

					break;

				case 'groupScale':
					tools.scaleOrigin.reset();
					tools.scaleThumb.reset();

					break;

				case 'color':
					return;
			}

			general.action.type = null;
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

export default useCanvas;

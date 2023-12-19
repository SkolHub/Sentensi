import { RendererWordPointModel, Word } from './models';
import { getAngleAndDistance, getPointOnBezier, getPointOnCircle } from './math.ts';
import { Tools } from './tools.ts';

const PATH_LENGTH_PRECISION = 5000;

const RENDER_CURVE: boolean = false;

class Renderer {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d')!;
	}

	measure(text: string, font: string) {
		this.ctx.font = font;

		return this.ctx.measureText(text);
	}

	renderTools(tools: Tools) {
		this.ctx.strokeStyle = '#000000';
		this.ctx.lineWidth = 3;

		this.ctx.beginPath();
		this.ctx.rect(tools.selectBox.state.x, tools.selectBox.state.y, tools.selectBox.state.width, tools.selectBox.state.height);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.arc(tools.rotationTrack.state.x, tools.rotationTrack.state.y, 60, 0, 2 * Math.PI);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.arc(tools.rotationThumb.state.x, tools.rotationThumb.state.y, 10, 0, 2 * Math.PI);
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.rect(tools.scaleThumb.state.x - 10, tools.scaleThumb.state.y - 10, 20, 20);
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.arc(tools.scaleOrigin.state.x, tools.scaleOrigin.state.y, 2, 0, 2 * Math.PI);
		this.ctx.fill();
	}

	initializeWordContext(word: Word) {
		this.ctx.fillStyle = word.color.top;
		this.ctx.font = `${word.fontSize}px Whiteboard`;
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
	}

	render(words: Word[], tools: Tools) {
		this.clear();

		words.forEach(word => {
			this.renderWord(word);
		});

		this.renderTools(tools);
	}

	renderWord(word: Word) {
		const { start, control, end } = Renderer.getOrigins(word);

		if (RENDER_CURVE) {
			this.ctx.moveTo(start.x, start.y);
			this.ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);

			this.ctx.stroke();
		}

		this.initializeWordContext(word);

		let points: RendererWordPointModel[] = [], totalLength = 0;

		for (let i = 0; i < PATH_LENGTH_PRECISION; i++) {
			const pointA = getPointOnBezier(
				start,
				control,
				end,
				i / PATH_LENGTH_PRECISION
			);

			const pointB = getPointOnBezier(
				start,
				control,
				end,
				(i + 1) / PATH_LENGTH_PRECISION
			);

			const pointC = getAngleAndDistance(pointA, pointB);

			totalLength += pointC.dist;

			points.push({
				bezier: pointA,
				curve: pointC
			});
		}

		const gap = (totalLength - this.ctx.measureText(word.content).width) / (word.content.length - 1);

		let x1 = this.ctx.measureText(word.content[0]).width / 2, x2 = 0, p = 0;

		for (let j = p; j < PATH_LENGTH_PRECISION; j++) {
			x2 += points[j].curve.dist;
			if (x2 >= x1) {
				p = j;
				break;
			}
		}

		this.ctx.beginPath();

		for (let i = 0; i < word.content.length; i++) {
			this.ctx.save();
			this.ctx.translate(points[p].bezier.x, points[p].bezier.y - 2);
			this.ctx.rotate(points[p].curve.rad);
			this.ctx.fillText(word.content[i], 0, 0);
			this.ctx.restore();

			const textMetrics = this.ctx.measureText(word.content[i]);
			const actualHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

			x1 =
				textMetrics.width / 2 +
				this.ctx.measureText(word.content[i + 1]).width / 2 +
				gap;
			x2 = 0;

			const ang = Math.atan(actualHeight / textMetrics.width);

			word.letterBoxes![i] = Renderer.getLetterBox(points[p], ang, textMetrics.width, actualHeight);

			for (let j = p; j < PATH_LENGTH_PRECISION; j++) {
				x2 += points[j].curve.dist;
				if (x2 >= x1) {
					p = j;
					break;
				}
			}
		}
	};

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	static getOrigins(word: Word) {
		return {
			start: word.start,
			control: {
				x: word.start.x + word.control.x,
				y: word.start.y + word.control.y
			},
			end: {
				x: word.start.x + word.end.x,
				y: word.start.y + word.end.y
			}
		};
	}

	static getLetterBox(point: RendererWordPointModel, ang: number, width: number, height: number) {
		const radius = 0.5 * Math.sqrt(width ** 2 + height ** 2);

		return {
			A: getPointOnCircle(point.bezier, radius, Math.PI + point.curve.rad + ang),
			B: getPointOnCircle(point.bezier, radius, point.curve.rad - ang),
			C: getPointOnCircle(point.bezier, radius, point.curve.rad + ang),
			D: getPointOnCircle(point.bezier, radius, Math.PI + point.curve.rad - ang)
		};
	}
}

export {
	Renderer
};
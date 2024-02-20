import { Point, Word } from '../../models';
import {
	getPosAndAngle,
	splitBezierIntoLengths
} from '@/lib/logic/packages/words/word-math';

export class WordData {
	static readonly PATH_LENGTH_PRECISION = 5000;

	ctx: CanvasRenderingContext2D;

	start: Point;
	control: Point;
	end: Point;
	word: Word;

	totalLength: number;

	lengths: number[];

	gap: number;

	prevLetterMetrics: TextMetrics;

	pointOnBezier: number = 0;

	letterIndex: number = 0;

	constructor(word: Word, ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;

		this.ctx.font = `${word.fontSize}px Whiteboard`;

		this.start = word.start;

		this.control = {
			x: word.start.x + word.control.x,
			y: word.start.y + word.control.y
		};

		this.end = {
			x: word.start.x + word.end.x,
			y: word.start.y + word.end.y
		};

		this.word = word;

		const { totalLength, lengths } = splitBezierIntoLengths(
			this.start,
			this.control,
			this.end,
			WordData.PATH_LENGTH_PRECISION
		);

		this.totalLength = totalLength;
		this.lengths = lengths;

		let width = 0;

		for (const letter of word.content) {
			width += ctx.measureText(letter).width;
		}

		this.gap = (totalLength - width) / (word.content.length - 1);

		this.prevLetterMetrics = ctx.measureText(word.content[0]);

		for (
			let x1 = this.prevLetterMetrics.width / 2, x2 = 0;
			x2 < x1;
			x2 += lengths[this.pointOnBezier++]
		);
	}

	getPosAndAngle() {
		return getPosAndAngle(
			this.start,
			this.control,
			this.end,
			this.pointOnBezier / WordData.PATH_LENGTH_PRECISION,
			(this.pointOnBezier + 1) / WordData.PATH_LENGTH_PRECISION
		);
	}

	nextLetter() {
		const letterMetrics = this.ctx.measureText(
			this.word.content[++this.letterIndex]
		);

		for (
			let x1 =
					(this.prevLetterMetrics.width + letterMetrics.width) / 2 + this.gap,
				x2 = 0;
			x2 < x1;
			x2 += this.lengths[this.pointOnBezier++]
		);

		this.prevLetterMetrics = letterMetrics;
	}
}

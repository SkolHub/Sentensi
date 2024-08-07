import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { CreateGeneral } from '@/lib/logic/packages/generals/create.general';
import { Point, Word } from '@/lib/logic/models';
import { WordData } from '@/lib/logic/packages/words/word-data';
import {
	checkPointSide,
	getPointOnCircle,
	segmentsIntersect
} from '@/lib/logic/math';
import { WordHandlerPackage } from '@/lib/logic/packages/words/word-handler.package';
import { WordRenderPackage } from '@/lib/logic/packages/words/word-render.package';

export class WordsPackage extends SentensiPackage<CreateGeneral> {
	sizingMode: 'stretch' | 'scale' = 'stretch';
	doubleColor!: boolean;

	wordHandlers: WordHandlerPackage = new WordHandlerPackage(this.general);
	wordRender: WordRenderPackage = new WordRenderPackage(this.general);

	constructor(general: CreateGeneral) {
		super(general);
	}

	getClickedWord(point: Point):
		| {
				word: Word;
				letter: number;
		  }
		| undefined {
		const words = this.general.words;

		for (const word of words) {
			const wordData = new WordData(word, this.ctx);

			for (let i = 0; i < word.content.length; i++) {
				const { pos, ang } = wordData.getPosAndAngle();

				const actualHeight =
					wordData.prevLetterMetrics.actualBoundingBoxAscent +
					wordData.prevLetterMetrics.actualBoundingBoxDescent;

				const dAng = Math.atan(actualHeight / wordData.prevLetterMetrics.width);

				const { A, B, C, D } = WordsPackage.getLetterBox(
					pos,
					ang,
					dAng,
					wordData.prevLetterMetrics.width,
					actualHeight
				);

				if (
					checkPointSide(point, A, B) &&
					checkPointSide(point, B, C) &&
					checkPointSide(point, C, D) &&
					checkPointSide(point, D, A)
				) {
					return {
						word,
						letter: i
					};
				}

				wordData.nextLetter();
			}
		}

		return undefined;
	}

	checkWords(point: Point): boolean {
		const res = this.getClickedWord(point);

		if (res) {
			if (this.general.action === 'color') {
				if (this.doubleColor) {
					res.word.color.bottom = res.word.color.top;
					res.word.color.top = this.general.color;
				} else {
					res.word.color.top = res.word.color.bottom = this.general.color;
				}

				return true;
			}

			if (res.letter === 0) {
				this.general.action = 'move';

				this.wordHandlers.initMove(res.word, point);
			} else if (res.letter === res.word.content.length - 1) {
				this.wordHandlers.initStretchOrScale(res.word, point);

				this.general.action = this.sizingMode;
			} else {
				this.wordHandlers.initBend(res.word);

				this.general.action = 'bend';
			}

			return true;
		}

		return false;
	}

	handleWords(point: Point): boolean {
		switch (this.general.action) {
			case 'move':
				this.wordHandlers.handleMove(point);

				return true;

			case 'bend':
				this.wordHandlers.handleBend(point);

				return true;

			case 'stretch':
				this.wordHandlers.handleStretch(point);

				return true;

			case 'scale':
				this.wordHandlers.handleScale(point);

				return true;
		}

		return false;
	}

	handleErase(point: Point) {
		if (this.general.action !== 'erase') return;

		let ok = true;

		for (let j = 0; j < this.general.words.length && ok; j++) {
			const wordData = new WordData(this.general.words[j], this.ctx);

			for (let i = 0; i < this.general.words[j].content.length; i++) {
				const { pos, ang } = wordData.getPosAndAngle();

				const actualHeight =
					wordData.prevLetterMetrics.actualBoundingBoxAscent +
					wordData.prevLetterMetrics.actualBoundingBoxDescent;

				const dAng = Math.atan(actualHeight / wordData.prevLetterMetrics.width);

				const { A, B, C, D } = WordsPackage.getLetterBox(
					pos,
					ang,
					dAng,
					wordData.prevLetterMetrics.width,
					actualHeight
				);

				if (
					segmentsIntersect(A, B, point, this.general.lastDrawPoint) ||
					segmentsIntersect(B, C, point, this.general.lastDrawPoint) ||
					segmentsIntersect(C, D, point, this.general.lastDrawPoint) ||
					segmentsIntersect(C, A, point, this.general.lastDrawPoint)
				) {
					this.general.words.splice(j, 1);

					ok = false;

					break;
				}

				wordData.nextLetter();
			}
		}

		this.general.lastDrawPoint = point;
	}

	render() {
		this.wordRender.render();
	}

	static getLetterBox(
		point: Point,
		ang: number,
		dAng: number,
		width: number,
		height: number
	) {
		// ang = rotation of letter, dAng = angle inside letter box determined by width and height
		const radius = 0.5 * Math.sqrt(width ** 2 + height ** 2);

		return {
			A: getPointOnCircle(radius, Math.PI + ang + dAng, point),
			B: getPointOnCircle(radius, ang - dAng, point),
			C: getPointOnCircle(radius, ang + dAng, point),
			D: getPointOnCircle(radius, Math.PI + ang - dAng, point)
		};
	}
}

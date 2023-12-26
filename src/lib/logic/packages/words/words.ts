import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { CreateGeneral } from '@/lib/logic/packages/generals/create-general';
import { Point, Word } from '@/lib/logic/models';
import { WordData } from '@/lib/logic/packages/words/word-data';
import { checkPointSide, getPointOnCircle, stretchAngle, stretchLength } from '@/lib/logic/math';
import {
	handleBend,
	HandleBendModel,
	handleMove,
	HandleMoveModel,
	handleStretch, HandleStretchModel
} from '@/lib/logic/packages/words/word-handlers';

export class Words extends SentensiPackage<CreateGeneral> {
	sizingMode: 'stretch' | 'scale';

	constructor(canvas: HTMLCanvasElement, general: CreateGeneral, sizingMode: 'stretch' | 'scale') {
		super(canvas, general);

		this.sizingMode = sizingMode;
	}

	checkWords(point: Point): boolean {
		const words = this.general.words;

		for (const word of words) {
			const wordData = new WordData(word, this.ctx);

			for (let i = 0; i < word.content.length; i++) {
				const { pos, ang } = wordData.getPosAndAngle();

				const actualHeight =
					wordData.prevLetterMetrics.actualBoundingBoxAscent +
					wordData.prevLetterMetrics.actualBoundingBoxDescent;

				const dAng = Math.atan(actualHeight / wordData.prevLetterMetrics.width);

				const { A, B, C, D } = Words.getLetterBox(
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
					if (i == 0) {
						this.general.action = 'move';

						this.general.details = { point };
					} else if (i == word.content.length - 1) {
						this.general.action = 'stretch';

						this.general.details = {
							length: stretchLength(word),
							angle: stretchAngle(word)
						};
					} else {
						this.general.action = 'bend';
					}

					this.general.details.target = word;

					return true;
				}

				wordData.nextLetter();
			}
		}

		return false;
	}

	handleWords(point: Point): boolean {
		switch (this.general.action) {
			case 'move':
				handleMove(this.general.details as HandleMoveModel, point);

				return true;

			case 'bend':
				handleBend(this.general.details as HandleBendModel, point);

				return true;

			case 'stretch':
				handleStretch(
					this.general.details as HandleStretchModel,
					point,
					this.sizingMode === 'stretch',
					this.measure(
						(this.general.details.target as Word).content,
						(this.general.details.target as Word).fontSize
					).width
				);

				return true;
		}

		return false;
	}

	displayLetter(pos: Point, ang: number, letter: string) {
		this.ctx.save();
		this.ctx.translate(pos.x, pos.y - 2);
		this.ctx.rotate(ang);
		this.ctx.fillText(letter, 0, 0);
		this.ctx.restore();
	}

	renderWord(word: Word) {
		this.ctx.fillStyle = word.color.top;
		this.ctx.font = `${word.fontSize}px Whiteboard`;
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';

		const wordData = new WordData(word, this.ctx);

		this.ctx.beginPath();

		for (let i = 0; i < word.content.length - 1; i++) {
			const { pos, ang } = wordData.getPosAndAngle();
			this.displayLetter(pos, ang, word.content[i]);

			wordData.nextLetter();
		}

		const { pos, ang } = wordData.getPosAndAngle();
		this.displayLetter(pos, ang, word.content[word.content.length - 1]);

		this.ctx.strokeStyle = 'red';

		this.ctx.moveTo(word.start.x, word.start.y);
		this.ctx.quadraticCurveTo(
			word.control.x + word.start.x,
			word.control.y + word.start.y,
			word.end.x + word.start.x,
			word.end.y + word.start.y
		);

		this.ctx.stroke();
	}

	render() {
		for (const word of this.general.words) {
			this.renderWord(word);
		}
	}

	static getLetterBox(point: Point, ang: number, dAng: number, width: number, height: number) {
		// ang = rotation of letter, dAng = angle inside letter box determined by width and height
		const radius = 0.5 * Math.sqrt(width ** 2 + height ** 2);

		return {
			A: getPointOnCircle(point, radius, Math.PI + ang + dAng),
			B: getPointOnCircle(point, radius, ang - dAng),
			C: getPointOnCircle(point, radius, ang + dAng),
			D: getPointOnCircle(point, radius, Math.PI + ang - dAng)
		};
	}
}

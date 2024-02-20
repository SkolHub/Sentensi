import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { MainGeneral } from '@/lib/logic/packages/generals/main.general';
import { Point, Word } from '@/lib/logic/models';
import {
	checkPointSide,
	getSlope,
	getXOnCircle,
	getYOnCircle,
	pyth
} from '@/lib/logic/math';
import { WordData } from '@/lib/logic/packages/words/word-data';
import { WordsPackage } from '@/lib/logic/packages/words/words.package';

export class WordRenderPackage extends SentensiPackage<MainGeneral> {
	constructor(general: MainGeneral) {
		super(general);
	}

	displayLetter(pos: Point, ang: number, letter: string, word: Word) {
		this.ctx.fillStyle = word.color.top;

		this.ctx.save();
		this.ctx.translate(pos.x, pos.y - 2);
		this.ctx.rotate(ang);
		this.ctx.fillText(letter, 0, 0);
		this.ctx.restore();

		this.ctx.fillStyle = word.color.bottom;

		this.ctx.save();

		this.ctx.moveTo(word.start.x, word.start.y);
		this.ctx.quadraticCurveTo(
			word.control.x + word.start.x,
			word.control.y + word.start.y,
			word.end.x + word.start.x,
			word.end.y + word.start.y
		);

		const radius = pyth(word.end);
		const clipAng = getSlope({ x: 0, y: 0 }, word.end);

		this.ctx.lineTo(
			getXOnCircle(word.start.x, radius * 2, clipAng),
			getYOnCircle(word.start.y, radius * 2, clipAng)
		);

		this.ctx.lineTo(
			getXOnCircle(word.start.x, radius, clipAng + Math.PI / 4),
			getYOnCircle(word.start.y, radius, clipAng + Math.PI / 4)
		);

		this.ctx.lineTo(
			getXOnCircle(word.start.x + word.end.x, radius * 2, clipAng + Math.PI),
			getYOnCircle(word.start.y + word.end.y, radius * 2, clipAng + Math.PI)
		);

		this.ctx.clip();
		this.ctx.translate(pos.x, pos.y - 2);
		this.ctx.rotate(ang);
		this.ctx.fillText(letter, 0, 0);
		this.ctx.restore();
	}

	renderWord(word: Word) {
		this.ctx.font = `${word.fontSize}px Whiteboard`;
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';

		const wordData = new WordData(word, this.ctx);

		this.ctx.beginPath();

		for (let i = 0; i < word.content.length - 1; i++) {
			const { pos, ang } = wordData.getPosAndAngle();
			this.displayLetter(pos, ang, word.content[i], word);

			wordData.nextLetter();
		}

		const { pos, ang } = wordData.getPosAndAngle();
		this.displayLetter(pos, ang, word.content[word.content.length - 1], word);
	}

	render() {
		for (const word of this.general.words) {
			this.renderWord(word);
		}
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
}

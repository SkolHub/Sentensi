import { Point, Word } from '@/lib/logic/models';
import { Tool } from '@/lib/logic/packages/tools/tool';
import { contained } from '@/lib/logic/math';
import {
	HandleGroupMoveModel,
	HandleSelectModel,
	SelectToolModel
} from '@/lib/logic/packages/tools/models';
import { CreateGeneral } from '@/lib/logic/packages/generals/create.general';
import { WordData } from '@/lib/logic/packages/words/word-data';
import { WordsPackage } from '@/lib/logic/packages/words/words';

const InitialSelectTool: SelectToolModel = {
	x: -100,
	y: -100,
	width: 0,
	height: 0
};

export class SelectTool extends Tool<SelectToolModel> {
	static readonly BOX_BORDER_COLOR = '#004B88';
	static readonly BOX_COLOR = 'rgba(0,75,136,0.2)';
	static readonly BOX_BORDER_WIDTH = 2;

	static readonly SELECT_EXTRA_SPACE = 30;

	constructor(general: CreateGeneral) {
		super(InitialSelectTool, general);
	}

	render() {
		this.ctx.strokeStyle = SelectTool.BOX_BORDER_COLOR;
		this.ctx.fillStyle = SelectTool.BOX_COLOR;
		this.ctx.lineWidth = SelectTool.BOX_BORDER_WIDTH;

		this.ctx.beginPath();
		this.ctx.rect(
			this.state.x,
			this.state.y,
			this.state.width,
			this.state.height
		);

		this.ctx.fill();
		this.ctx.stroke();
	}

	handleSelect(point: Point) {
		const details = this.general.details as HandleSelectModel;

		this.state = {
			x: Math.min(details.point.x, point.x),
			y: Math.min(details.point.y, point.y),
			width: Math.abs(details.point.x - point.x),
			height: Math.abs(details.point.y - point.y)
		};
	}

	handleGroupMove(point: Point) {
		const details: HandleGroupMoveModel = this.general
			.details as HandleGroupMoveModel;

		for (const word of details.target) {
			word.start.x += point.x - details.point.x;
			word.start.y += point.y - details.point.y;
		}

		details.point = point;
	}

	finishSelect(): Word[] {
		let top = Number.MAX_SAFE_INTEGER,
			bottom = 0,
			left = Number.MAX_SAFE_INTEGER,
			right = 0;

		const updateBoxSize = (point: Point) => {
			if (point.x > right) {
				right = point.x;
			}

			if (point.x < left) {
				left = point.x;
			}

			if (point.y > bottom) {
				bottom = point.y;
			}

			if (point.y < top) {
				top = point.y;
			}
		};

		const newWords = this.general.words.filter((word) => {
			const wordData = new WordData(word, this.ctx);

			let ok = false,
				i;

			const points = [];

			for (i = 0; i < word.content.length; i++) {
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

				const pointList = [A, B, C, D];

				points.push(...pointList);

				for (let j = 0; j < pointList.length; j++) {
					if (
						contained(
							pointList[j],
							this.state.x,
							this.state.y,
							this.state.width,
							this.state.height
						)
					) {
						ok = true;
						break;
					}
				}

				if (ok) {
					break;
				}

				wordData.nextLetter();
			}

			if (ok) {
				points.forEach(updateBoxSize);

				for (; i < word.content.length; i++) {
					const { pos, ang } = wordData.getPosAndAngle();

					const actualHeight =
						wordData.prevLetterMetrics.actualBoundingBoxAscent +
						wordData.prevLetterMetrics.actualBoundingBoxDescent;

					const dAng = Math.atan(
						actualHeight / wordData.prevLetterMetrics.width
					);

					const { A, B, C, D } = WordsPackage.getLetterBox(
						pos,
						ang,
						dAng,
						wordData.prevLetterMetrics.width,
						actualHeight
					);

					const pointList = [A, B, C, D];

					pointList.forEach(updateBoxSize);

					wordData.nextLetter();
				}
			}

			return ok;
		});

		this.state = {
			x: left - SelectTool.SELECT_EXTRA_SPACE,
			y: top - SelectTool.SELECT_EXTRA_SPACE,
			width: right - left + SelectTool.SELECT_EXTRA_SPACE * 2,
			height: bottom - top + SelectTool.SELECT_EXTRA_SPACE * 2
		};

		return newWords;
	}

	activate(point: Point): boolean {
		return contained(
			point,
			this.state.x,
			this.state.y,
			this.state.width,
			this.state.height
		);
	}
}

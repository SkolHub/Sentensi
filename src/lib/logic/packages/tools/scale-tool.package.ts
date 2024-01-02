import { Point, Word } from '@/lib/logic/models';
import { Tool } from '@/lib/logic/packages/tools/tool';
import { contained } from '@/lib/logic/math';
import {
	ScaleToolModel,
	SelectToolModel
} from '@/lib/logic/packages/tools/models';
import { CreateGeneral } from '@/lib/logic/packages/generals/create.general';

const InitialScaleTool: ScaleToolModel = {
	x: -100,
	y: -100
};

export class ScaleToolPackage extends Tool<ScaleToolModel> {
	static readonly THUMB_WIDTH = 20;
	static readonly THUMB_COLOR = '#FFFFFF';
	static readonly THUMB_BORDER_COLOR = '#004B88';
	static readonly THUMB_BORDER_WIDTH = 2;

	targets!: Word[];

	point!: Point;
	origin!: SelectToolModel;

	originals!: {
		start: Point;
		control: Point;
		end: Point;
		fontSize: number;
	}[];

	constructor(general: CreateGeneral) {
		super(InitialScaleTool, general);
	}

	render() {
		this.ctx.fillStyle = ScaleToolPackage.THUMB_COLOR;
		this.ctx.strokeStyle = ScaleToolPackage.THUMB_BORDER_COLOR;
		this.ctx.lineWidth = ScaleToolPackage.THUMB_BORDER_WIDTH;

		this.ctx.beginPath();

		this.renderCorner(this.state.x, this.state.y);
	}

	initGroupScale(point: Point): boolean {
		if (
			contained(
				point,
				this.state.x - ScaleToolPackage.THUMB_WIDTH / 2,
				this.state.y - ScaleToolPackage.THUMB_WIDTH / 2,
				ScaleToolPackage.THUMB_WIDTH,
				ScaleToolPackage.THUMB_WIDTH
			)
		) {
			this.origin = this.general.toolsPkg.select.state;
			this.targets = this.general.toolsPkg.targets;

			this.originals = this.general.toolsPkg.targets.map((word) => ({
				fontSize: word.fontSize,
				start: {
					x: word.start.x - this.origin.x,
					y: word.start.y - this.origin.y
				},
				control: { ...word.control },
				end: { ...word.end }
			}));

			return true;
		}

		return false;
	}

	handleGroupScale(point: Point) {
		const mod = Math.max(
			(point.x - this.origin.x) / this.origin.width,
			(point.y - this.origin.y) / this.origin.height
		);

		for (const word of this.originals) {
			if (word.fontSize * mod < 50) {
				return;
			}
		}

		this.state = {
			x: this.origin.x + this.origin.width * mod,
			y: this.origin.y + this.origin.height * mod
		};

		this.targets.forEach((word, i) => {
			word.start.x = this.originals[i].start.x * mod + this.origin.x;
			word.start.y = this.originals[i].start.y * mod + this.origin.y;
			word.control.x = this.originals[i].control.x * mod;
			word.control.y = this.originals[i].control.y * mod;
			word.end.x = this.originals[i].end.x * mod;
			word.end.y = this.originals[i].end.y * mod;
			word.fontSize = this.originals[i].fontSize * mod;
		});
	}

	private renderCorner(x: number, y: number) {
		this.ctx.rect(
			Math.round(x - ScaleToolPackage.THUMB_WIDTH / 2),
			Math.round(y - ScaleToolPackage.THUMB_WIDTH / 2),
			ScaleToolPackage.THUMB_WIDTH,
			ScaleToolPackage.THUMB_WIDTH
		);

		this.ctx.fill();
		this.ctx.stroke();
	}
}

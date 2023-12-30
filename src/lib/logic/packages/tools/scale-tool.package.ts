import { Point } from '@/lib/logic/models';
import { Tool } from '@/lib/logic/packages/tools/tool';
import { contained, getXOnCircle, getYOnCircle } from '@/lib/logic/math';
import {
	HandleGroupScaleModel,
	ScaleToolModel
} from '@/lib/logic/packages/tools/models';
import { CreateGeneral } from '@/lib/logic/packages/generals/create.general';

const InitialScaleTool: ScaleToolModel = {
	thumb: {
		x: -100,
		y: -100
	},
	origin: {
		x: -100,
		y: -100
	}
};

export class ScaleToolPackage extends Tool<ScaleToolModel> {
	static readonly ORIGIN_RADIUS = 2;
	static readonly ORIGIN_COLOR = '#000000';

	static readonly THUMB_WIDTH = 20;
	static readonly THUMB_COLOR = '#000000';

	constructor(general: CreateGeneral) {
		super(InitialScaleTool, general);
	}

	render() {
		this.ctx.fillStyle = ScaleToolPackage.THUMB_COLOR;

		this.ctx.beginPath();
		this.ctx.rect(
			this.state.thumb.x - ScaleToolPackage.THUMB_WIDTH / 2,
			this.state.thumb.y - ScaleToolPackage.THUMB_WIDTH / 2,
			ScaleToolPackage.THUMB_WIDTH,
			ScaleToolPackage.THUMB_WIDTH
		);
		this.ctx.fill();

		this.ctx.fillStyle = ScaleToolPackage.ORIGIN_COLOR;

		this.ctx.beginPath();
		this.ctx.arc(
			this.state.origin.x,
			this.state.origin.y,
			ScaleToolPackage.ORIGIN_RADIUS,
			0,
			2 * Math.PI
		);
		this.ctx.fill();
	}

	handleGroupScale(x: number) {
		const details = this.general.details as HandleGroupScaleModel;

		const radius =
				details.distance + (x - details.length) / Math.cos(details.angle),
			mod = (radius / details.distance) * 2;

		for (const word of details.origins) {
			if (word.fontSize * mod < 55.59) {
				console.log(word.fontSize, mod);
				return;
			}
		}

		details.targets.forEach((word, index) => {
			word.start.x =
				(details.origins[index].start.x - details.point.x) * mod +
				details.point.x;
			word.start.y =
				(details.origins[index].start.y - details.point.y) * mod +
				details.point.y;
			word.control.x = details.origins[index].control.x * mod;
			word.control.y = details.origins[index].control.y * mod;
			word.end.x = details.origins[index].end.x * mod;
			word.end.y = details.origins[index].end.y * mod;
			word.fontSize = details.origins[index].fontSize * mod;
		});

		this.state.thumb = {
			x: getXOnCircle(details.point.x, radius, -details.angle) - 5,
			y: getYOnCircle(details.point.y, radius, -details.angle) - 5
		};
	}

	activate(point: Point): boolean {
		return contained(
			point,
			this.state.thumb.x - ScaleToolPackage.THUMB_WIDTH / 2,
			this.state.thumb.y - ScaleToolPackage.THUMB_WIDTH / 2,
			ScaleToolPackage.THUMB_WIDTH,
			ScaleToolPackage.THUMB_WIDTH
		);
	}
}

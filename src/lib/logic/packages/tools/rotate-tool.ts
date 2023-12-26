import { Point, Word } from '@/lib/logic/models';
import { Tool } from '@/lib/logic/packages/tools/tool';
import { getPointOnCircle, getSlope, getXOnCircle, getYOnCircle, pyth } from '@/lib/logic/math';

interface RotateToolModel {
	thumb: {
		x: number;
		y: number;
	};
	track: {
		x: number;
		y: number;
	};
}

const InitialRotateTool: RotateToolModel = {
	thumb: {
		x: -100,
		y: -100
	},
	track: {
		x: -100,
		y: -100
	}
};

export interface HandleGroupRotateModel {
	target: Word[];
	point: Point;
	lengths: {
		startDistance: number;
		focusDistance: number;
		endDistance: number;
	}[];
	angles: { startAngle: number; focusAngle: number; endAngle: number }[];
}

export class RotateTool extends Tool<RotateToolModel> {
	static readonly THUMB_RADIUS = 10;
	static readonly THUMB_COLOR = '#000000';

	static readonly TRACK_RADIUS = 60;
	static readonly TRACK_COLOR = '#000000';
	static readonly TRACK_WIDTH = 1;

	constructor(ctx: CanvasRenderingContext2D) {
		super(InitialRotateTool, ctx);
	}

	render() {
		this.ctx.fillStyle = RotateTool.THUMB_COLOR;
		this.ctx.strokeStyle = RotateTool.TRACK_COLOR;
		this.ctx.lineWidth = RotateTool.TRACK_WIDTH;

		this.ctx.beginPath();
		this.ctx.arc(this.state.track.x, this.state.track.y, RotateTool.TRACK_RADIUS, 0, 2 * Math.PI);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.arc(this.state.thumb.x, this.state.thumb.y, RotateTool.THUMB_RADIUS, 0, 2 * Math.PI);
		this.ctx.fill();
	}

	handleGroupRotate(details: HandleGroupRotateModel, point: Point) {
		let ang = -getSlope(details.point, point);

		this.state.thumb = getPointOnCircle(details.point, RotateTool.TRACK_RADIUS, ang);

		ang += Math.PI / 2;

		details.target.forEach((word, index) => {
			const x = getXOnCircle(
				details.point.x,
				details.lengths![index].startDistance,
				details.angles![index].startAngle + ang
			);

			const y = getYOnCircle(
				details.point.y,
				details.lengths![index].startDistance,
				details.angles![index].startAngle + ang
			);

			word.start.x = x;
			word.start.y = y;

			word.control.x =
				getXOnCircle(
					details.point.x,
					details.lengths![index].focusDistance,
					details.angles![index].focusAngle + ang
				) - x;

			word.control.y =
				getYOnCircle(
					details.point.y,
					details.lengths![index].focusDistance,
					details.angles![index].focusAngle + ang
				) - y;

			word.end.x =
				getXOnCircle(
					details.point.x,
					details.lengths![index].endDistance,
					details.angles![index].endAngle + ang
				) - x;

			word.end.y =
				getYOnCircle(
					details.point.y,
					details.lengths![index].endDistance,
					details.angles![index].endAngle + ang
				) - y;
		});
	}

	activate(point: Point): boolean {
		return pyth(point, this.state.thumb) <= RotateTool.THUMB_RADIUS;
	}
}

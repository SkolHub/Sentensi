import { Point, Word } from '@/lib/logic/models';
import { Tool } from '@/lib/logic/packages/tools/tool';
import {
	getPointOnCircle,
	getSlope,
	getXOnCircle,
	getYOnCircle,
	groupRotateAngles,
	groupRotateLengths,
	pyth
} from '@/lib/logic/math';
import { RotateToolModel } from '@/lib/logic/packages/tools/models';
import { CreateGeneral } from '@/lib/logic/packages/generals/create.general';

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

export class RotateToolPackage extends Tool<RotateToolModel> {
	static readonly THUMB_RADIUS = 10;
	static readonly THUMB_COLOR = '#000000';

	static readonly TRACK_RADIUS = 60;
	static readonly TRACK_COLOR = '#000000';
	static readonly TRACK_WIDTH = 1;

	targets!: Word[];

	lengths!: {
		start: number;
		control: number;
		end: number;
	}[];

	angles!: { start: number; control: number; end: number }[];

	constructor(general: CreateGeneral) {
		super(InitialRotateTool, general);
	}

	render() {
		this.ctx.fillStyle = RotateToolPackage.THUMB_COLOR;
		this.ctx.strokeStyle = RotateToolPackage.TRACK_COLOR;
		this.ctx.lineWidth = RotateToolPackage.TRACK_WIDTH;

		this.ctx.beginPath();
		this.ctx.arc(
			this.state.track.x,
			this.state.track.y,
			RotateToolPackage.TRACK_RADIUS,
			0,
			2 * Math.PI
		);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.arc(
			this.state.thumb.x,
			this.state.thumb.y,
			RotateToolPackage.THUMB_RADIUS,
			0,
			2 * Math.PI
		);
		this.ctx.fill();
	}

	iniGroupRotate(point: Point): boolean {
		if (pyth(point, this.state.thumb) <= RotateToolPackage.THUMB_RADIUS) {
			this.targets = this.general.toolsPkg.targets;
			this.angles = groupRotateAngles(this.targets, this.state.track);
			this.lengths = groupRotateLengths(this.targets, this.state.track);

			return true;
		}

		return false;
	}

	handleGroupRotate(point: Point) {
		let ang = getSlope(this.state.track, point);

		this.state.thumb = getPointOnCircle(
			RotateToolPackage.TRACK_RADIUS,
			ang,
			this.state.track
		);

		ang += Math.PI / 2;

		this.targets.forEach((word, index) => {
			word.start.x = getXOnCircle(
				this.state.track.x,
				this.lengths[index].start,
				this.angles[index].start + ang
			);

			word.start.y = getYOnCircle(
				this.state.track.y,
				this.lengths[index].start,
				this.angles[index].start + ang
			);

			word.control.x =
				getXOnCircle(
					this.state.track.x,
					this.lengths[index].control,
					this.angles[index].control + ang
				) - word.start.x;

			word.control.y =
				getYOnCircle(
					this.state.track.y,
					this.lengths[index].control,
					this.angles[index].control + ang
				) - word.start.y;

			word.end.x =
				getXOnCircle(
					this.state.track.x,
					this.lengths[index].end,
					this.angles[index].end + ang
				) - word.start.x;

			word.end.y =
				getYOnCircle(
					this.state.track.y,
					this.lengths[index].end,
					this.angles[index].end + ang
				) - word.start.y;
		});
	}
}

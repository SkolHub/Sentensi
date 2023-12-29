import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { CreateGeneral } from '@/lib/logic/packages/generals/create-general';
import { Point } from '@/lib/logic/models';
import { pyth } from '@/lib/logic/math';

export class Draw extends SentensiPackage<CreateGeneral> {
	static readonly MIN_POINT_DISTANCE = 8;

	constructor(canvas: HTMLCanvasElement, general: CreateGeneral) {
		super(canvas, general);
	}

	checkDraw(point: Point) {
		this.general.action = 'draw';

		this.general.lines.push({
			points: [point, point],
			width: 5,
			color: '#000000'
		});
	}

	handleDraw(point: Point): void {
		if (this.general.action === 'draw') {
			this.general.lastDrawPoint = point;

			if (this.general.lines.length) {
				const points = this.general.lines[this.general.lines.length - 1].points;

				if (pyth(points[points.length - 1], point) > Draw.MIN_POINT_DISTANCE) {
					this.general.lines[this.general.lines.length - 1].points.push(point);
				}
			}
		}
	}

	finishDraw(point: Point): void {
		this.general.lines[this.general.lines.length - 1].points.push(point);
	}

	render() {
		this.general.lines.forEach((line, index) => {
			this.ctx.lineWidth = line.width;
			this.ctx.strokeStyle = line.color;
			this.ctx.lineCap = 'round';

			this.ctx.beginPath();
			this.ctx.moveTo(line.points[0].x, line.points[0].y);

			if (line.points.length < 3) {
				this.ctx.arc(
					line.points[0].x,
					line.points[0].y,
					line.width / 2,
					0,
					Math.PI * 2
				);
				this.ctx.fill();
				this.ctx.closePath();

				return;
			}

			let i;

			for (i = 1; i < line.points.length - 1; i++) {
				this.ctx.quadraticCurveTo(
					line.points[i].x,
					line.points[i].y,
					(line.points[i].x + line.points[i + 1].x) / 2,
					(line.points[i].y + line.points[i + 1].y) / 2
				);
			}

			if (index === this.general.lines.length - 1 && this.general.action === 'draw') {
				this.ctx.quadraticCurveTo(
					line.points[i].x,
					line.points[i].y,
					this.general.lastDrawPoint.x,
					this.general.lastDrawPoint.y
				);
			}

			this.ctx.stroke();
		});
	}
}

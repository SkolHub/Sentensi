import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { CreateGeneral } from '@/lib/logic/packages/generals/create.general';
import { Point } from '@/lib/logic/models';
import { pointToLineDistance, pyth, segmentsIntersect } from '@/lib/logic/math';

export class DrawPackage extends SentensiPackage<CreateGeneral> {
	static readonly MIN_POINT_DISTANCE = 8;

	lineWidth!: number;

	constructor(general: CreateGeneral) {
		super(general);
	}

	checkErase(point: Point) {
		this.general.action = 'erase';

		this.general.lastDrawPoint = point;
	}

	handleErase(point: Point) {
		if (this.general.action !== 'erase') return;

		for (let i = 0; i < this.general.lines.length; i++) {
			const points = this.general.lines[i].points;

			if (points.length < 4) {
				for (let j = 0; j < points.length; j++) {
					if (
						pointToLineDistance(points[j], point, this.general.lastDrawPoint) <
						this.general.lines[i].width + DrawPackage.MIN_POINT_DISTANCE
					) {
						this.general.lines.splice(i, 1);
						return;
					}
				}
			} else {
				for (let j = 1; j < points.length; j++) {
					if (
						segmentsIntersect(
							this.general.lastDrawPoint,
							point,
							points[j - 1],
							points[j]
						)
					) {
						this.general.lines.splice(i, 1);
						return;
					}
				}
			}
		}

		this.general.lastDrawPoint = point;
	}

	checkDraw(point: Point) {
		this.general.action = 'draw';

		this.general.lines.push({
			points: [point, point],
			width: this.lineWidth,
			color: this.general.color
		});
	}

	handleDraw(point: Point): void {
		if (this.general.action !== 'draw') return;

		this.general.lastDrawPoint = point;

		if (this.general.lines.length) {
			const points = this.general.lines[this.general.lines.length - 1].points;

			if (
				pyth(points[points.length - 1], point) > DrawPackage.MIN_POINT_DISTANCE
			) {
				this.general.lines[this.general.lines.length - 1].points.push(point);
			}
		}
	}

	finishDraw(point: Point): void {
		this.general.lines[this.general.lines.length - 1].points.push(point);
	}

	render() {
		this.general.lines.forEach((line, index) => {
			this.ctx.beginPath();

			if (line.points.length < 3) {
				this.ctx.fillStyle = line.color;

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

			this.ctx.lineWidth = line.width;
			this.ctx.strokeStyle = line.color;
			this.ctx.lineCap = 'round';

			this.ctx.beginPath();
			this.ctx.moveTo(line.points[0].x, line.points[0].y);

			for (i = 1; i < line.points.length - 1; i++) {
				this.ctx.quadraticCurveTo(
					line.points[i].x,
					line.points[i].y,
					(line.points[i].x + line.points[i + 1].x) / 2,
					(line.points[i].y + line.points[i + 1].y) / 2
				);
			}

			if (
				index === this.general.lines.length - 1 &&
				this.general.action === 'draw'
			) {
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

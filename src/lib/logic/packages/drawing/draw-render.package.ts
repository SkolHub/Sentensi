import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { MainGeneral } from '@/lib/logic/packages/generals/main.general';

export class DrawRenderPackage extends SentensiPackage<MainGeneral> {
	constructor(general: MainGeneral) {
		super(general);
	}

	render() {
		this.general.lines.forEach((line) => {
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

			/*if (
				index === this.general.lines.length - 1 &&
				this.general.action === 'draw'
			) {
				this.ctx.quadraticCurveTo(
					line.points[i].x,
					line.points[i].y,
					this.general.lastDrawPoint.x,
					this.general.lastDrawPoint.y
				);
			}*/

			this.ctx.stroke();
		});
	}
}

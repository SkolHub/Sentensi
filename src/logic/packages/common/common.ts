import { SentensiPackage } from '../../sentensi-package.ts';
import { General } from '../generals/general.ts';
import { CreateGeneral } from '../generals/create-general.ts';

export class Common extends SentensiPackage<General> {
	constructor(canvas: HTMLCanvasElement, general: CreateGeneral) {
		super(canvas, general);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
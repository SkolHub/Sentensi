import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { General } from '@/lib/logic/packages/generals/general';
import { CreateGeneral } from '@/lib/logic/packages/generals/create-general';

export class Common extends SentensiPackage<General> {
	constructor(canvas: HTMLCanvasElement, general: CreateGeneral) {
		super(canvas, general);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

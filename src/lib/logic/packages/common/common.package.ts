import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { MainGeneral } from '@/lib/logic/packages/generals/main.general';

export class CommonPackage extends SentensiPackage<MainGeneral> {
	constructor(general: MainGeneral) {
		super(general);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

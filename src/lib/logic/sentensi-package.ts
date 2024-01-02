import { MainGeneral } from '@/lib/logic/packages/generals/main.general';

export class SentensiPackage<T extends MainGeneral> {
	general: T;

	protected constructor(general: T) {
		this.general = general;
	}

	measure(text: string, size: number) {
		this.ctx.font = `${size}px Whiteboard`;
		return this.ctx.measureText(text);
	}

	get ctx(): CanvasRenderingContext2D {
		return this.general._ctx;
	}

	get canvas(): HTMLCanvasElement {
		return this.general._canvas;
	}
}

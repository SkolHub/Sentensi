export class SentensiPackage<T> {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	general: T;

	protected constructor(canvas: HTMLCanvasElement, general: T) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d')!;
		this.general = general;
	}

	measure(text: string, size: number) {
		this.ctx.font = `${size}px Whiteboard`;
		return this.ctx.measureText(text);
	}

	getClick(e: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect();

		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}
}

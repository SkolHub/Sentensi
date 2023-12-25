import { Point } from '../models';
import { initialBox, initialPoint } from '../initial.ts';
import { General } from '../general.ts';
import { SentensiPackage } from '../sentensi-package.ts';

type Subset<T> = {
	[K in keyof T]?: T[K];
};

abstract class Tool<T> {
	initialState: T;
	private _state: T;

	ctx: CanvasRenderingContext2D;

	constructor(tool: T, ctx: CanvasRenderingContext2D) {
		this.initialState = tool;
		this._state = tool;

		this.ctx = ctx;
	}

	get state(): T {
		return this._state;
	}

	set state(value: Subset<T>) {
		this._state = { ...this._state, ...value };
	}

	reset(): void {
		this._state = { ...this.initialState };
	}

	abstract render(): void;
}

interface SelectToolModel {
	x: number;
	y: number;
	width: number;
	height: number;
}

const InitialSelectTool = {
	x: -100,
	y: -100,
	width: 0,
	height: 0
};

class SelectTool extends Tool<SelectToolModel> {
	constructor(ctx: CanvasRenderingContext2D) {
		super(InitialSelectTool, ctx);
	}

	private renderSelectSquare(x: number, y: number) {
		this.ctx.beginPath();

		this.ctx.rect(x - 5, y - 5, 10, 10);

		this.ctx.fill();
		this.ctx.stroke();
	}

	render() {
		this.ctx.strokeStyle = '#004B88';
		this.ctx.fillStyle = 'rgba(0,75,136,0.2)';
		this.ctx.lineWidth = 1;

		this.ctx.beginPath();
		this.ctx.rect(this.state.x, this.state.y, this.state.width, this.state.height);

		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.fillStyle = '#FFFFFF';

		this.renderSelectSquare(this.state.x, this.state.y);
		this.renderSelectSquare(this.state.x + this.state.width, this.state.y);
		this.renderSelectSquare(this.state.x, this.state.y + this.state.height);
		this.renderSelectSquare(this.state.x + this.state.width, this.state.y + this.state.height);
	}
}

interface RotationToolModel {
	thumb: {
		x: number;
		y: number;
	};
	track: {
		x: number;
		y: number;
	};
}

class RotationTool extends Tool<RotationToolModel> {}

interface ScaleToolModel {
	thumb: {
		x: number;
		y: number;
	};
	origin: {
		x: number;
		y: number;
	};
}

class ScaleTool extends Tool<ScaleToolModel> {}

class Tools extends SentensiPackage {
	selectBox = new Tool<SelectBox>(initialBox);
	rotationTrack = new Tool<Point>(initialPoint);
	rotationThumb = new Tool<Point>(initialPoint);
	scaleThumb = new Tool<Point>(initialPoint);
	scaleOrigin = new Tool<Point>(initialPoint);

	constructor(canvas: HTMLCanvasElement, general: General) {
		super(canvas, general);
	}

	reset() {
		this.selectBox.reset();
		this.rotationTrack.reset();
		this.rotationThumb.reset();
		this.scaleThumb.reset();
		this.scaleOrigin.reset();
	}

	renderSelectTool() {}

	renderRotationTool() {}

	renderScaleTool() {}

	render() {
		this.ctx.beginPath();
		this.ctx.arc(tools.rotationTrack.state.x, tools.rotationTrack.state.y, 60, 0, 2 * Math.PI);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.arc(tools.rotationThumb.state.x, tools.rotationThumb.state.y, 10, 0, 2 * Math.PI);
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.rect(tools.scaleThumb.state.x - 10, tools.scaleThumb.state.y - 10, 20, 20);
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.arc(tools.scaleOrigin.state.x, tools.scaleOrigin.state.y, 2, 0, 2 * Math.PI);
		this.ctx.fill();
	}

	mouseDown() {}

	mouseMove() {}

	mouseUp() {}
}

export { Tools };

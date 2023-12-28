import { Point } from '../../models';

type Subset<T> = {
	[K in keyof T]?: T[K];
};

export abstract class Tool<T> {
	initialState: T;
	ctx: CanvasRenderingContext2D;

	protected constructor(tool: T, ctx: CanvasRenderingContext2D) {
		this.initialState = tool;
		this._state = tool;

		this.ctx = ctx;
	}

	private _state: T;

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

	abstract activate(point: Point): boolean;
}

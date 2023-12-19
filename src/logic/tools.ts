import { Point, SelectBox } from './models';
import { initialBox, initialPoint } from './initial.ts';

class Tool<T> {
	initialState: T;
	private _state: T;

	constructor(tool: T) {
		this.initialState = tool;
		this._state = tool;
	}

	reset() {
		this._state = { ...this.initialState };
	}

	get state() {
		return this._state;
	}

	set state(value: T) {
		this._state = { ...this._state, ...value };
	}
}

class Tools {
	selectBox = new Tool<SelectBox>(initialBox);
	rotationTrack = new Tool<Point>(initialPoint);
	rotationThumb = new Tool<Point>(initialPoint);
	scaleThumb = new Tool<Point>(initialPoint);
	scaleOrigin = new Tool<Point>(initialPoint);

	reset() {
		this.selectBox.reset();
		this.rotationTrack.reset();
		this.rotationThumb.reset();
		this.scaleThumb.reset();
		this.scaleOrigin.reset();
	}
}

export {
	Tools
};
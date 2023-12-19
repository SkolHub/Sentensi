export interface Point {
	x: number;
	y: number;
	rotX?: number;
	rotY?: number;
}

export interface Word {
	start: {
		x: number;
		y: number;
	};
	control: {
		x: number;
		y: number;
	};
	end: {
		x: number;
		y: number;
	};
	fontSize: number;
	color: {
		top: string;
		bottom: string;
	};
	content: string;
	letterBoxes?: { A: Point; B: Point; C: Point; D: Point }[];
}

export interface Action {
	type:
		| 'move'
		| 'stretch'
		| 'bend'
		| 'select'
		| 'groupMove'
		| 'groupRotate'
		| 'groupScale'
		| 'color'
		| null;
	details: {
		x?: number;
		y?: number;
		target?: Word;
		targets?: Word[];
		length?: number;
		angle?: number;
		lengths?: {
			startDistance: number;
			focusDistance: number;
			endDistance: number;
		}[];
		angles?: { startAngle: number; focusAngle: number; endAngle: number }[];
		origins?: {
			start: {
				x: number;
				y: number;
			};
			control: {
				x: number;
				y: number;
			};
			end: {
				x: number;
				y: number;
			};
			fontSize: number;
		}[];
		distance?: number;
		color?: string;
	};
}

export interface SelectBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface RendererWordPointModel {
	bezier: Point,
	curve: { rad: number, dist: number }
}

export type ActionType = 'Right or Wrong' | 'Listen and Write' | 'Remember and Write';

export interface PageModel {
	words: [];
	answer: string;
	type: ActionType;
}
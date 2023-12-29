export interface Point {
	x: number;
	y: number;
}

export interface SelectBox {
	x: number;
	y: number;
	width: number;
	height: number;
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
}

export type ActionType =
	| 'Right or Wrong'
	| 'Listen and Write'
	| 'Remember and Write';

export interface LineModel {
	color: string;
	width: number;
	points: Point[];
}

export interface PageModel {
	words: [];
	lines: LineModel[];
	answer: string[];
	type: ActionType;
}

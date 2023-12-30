export interface Point {
	x: number;
	y: number;
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

export type ActivityType =
	| 'Right or Wrong'
	| 'Listen and Write'
	| 'Remember and Write';

export interface LineModel {
	color: string;
	width: number;
	points: Point[];
}

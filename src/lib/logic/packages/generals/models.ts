import { ActivityData, ActivityType, LineModel, Point, Word } from '../../models';

export type ActionType =
	| 'move'
	| 'stretch'
	| 'scale'
	| 'bend'
	| 'select'
	| 'groupMove'
	| 'groupRotate'
	| 'groupScale'
	| 'color'
	| 'draw'
	| 'erase'
	| null;

export interface ActionDetails {
	point?: Point;
	target?: Word | Word[];
	length?: number;
	angle?: number;
	lengths?: {
		startDistance: number;
		focusDistance: number;
		endDistance: number;
	}[];
	angles?: { startAngle: number; focusAngle: number; endAngle: number }[];
	origins?: {
		start: Point;
		control: Point;
		end: Point;
		fontSize: number;
	}[];
	distance?: number;
	color?: string;
}

export interface PageModel {
	words: [];
	lines: LineModel[];
	answer: string[];
	type: ActivityType;
	data: ActivityData;
}

export interface CreateGeneralOptionsModel {
	mode: 'canvas' | 'text';
	pen: boolean;
	eraser: boolean;
}
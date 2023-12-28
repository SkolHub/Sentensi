import { Point, Word } from '@/lib/logic/models';
import { General } from '@/lib/logic/packages/generals/general';
import { Common } from '@/lib/logic/packages/common/common';

type ActionType =
	| 'move'
	| 'stretch'
	| 'bend'
	| 'select'
	| 'groupMove'
	| 'groupRotate'
	| 'groupScale'
	| 'color'
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

export class CreateGeneral extends General {
	action: ActionType = null;
	details: ActionDetails = {};

	common: Common | undefined;

	render: (() => void) | undefined;

	constructor() {
		super();
	}

	clearPage() {
		this.pages[this.currentPage].words = [];
		this.render!();
	}

	createPage() {}

	deletePage() {}
}

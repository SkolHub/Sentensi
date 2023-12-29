import { PageModel, Point, Word } from '@/lib/logic/models';
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
	| 'draw'
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

	lastDrawPoint: Point = { x: 0, y: 0 };

	render: (() => void) | undefined;

	constructor() {
		super();
	}

	clearPage() {
		this.pages[this.currentPage].words = [];
		this.pages[this.currentPage].lines = [];
		this.render!();
	}

	createPage() {
		const copy: PageModel = JSON.parse(
			JSON.stringify(this.pages[this.currentPage])
		);

		copy.answer = [];

		this.pages.push(copy);

		this.currentPage = this.pages.length - 1;
	}

	deletePage() {
		if (this.pages.length > 1) {
			this.pages.splice(this.currentPage, 1);

			if (this.currentPage > this.pages.length - 1) {
				this.currentPage = this.pages.length - 1;
			}
		}
	}
}

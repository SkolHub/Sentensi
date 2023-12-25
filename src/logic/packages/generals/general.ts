import { PageModel, Word } from '../../models';

export abstract class General {
	pages: PageModel[];
	currentPage: number = 0;
	canvas: HTMLCanvasElement | undefined;
	ctx: CanvasRenderingContext2D | undefined;

	protected constructor(pages?: any) {
		this.pages = pages ?? [
			{
				words: [],
				type: 'Remember and Write',
				answer: ''
			}
		];
	}

	setContext(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d')!;
	}

	get words(): Word[] {
		return this.pages[this.currentPage].words;
	}
}

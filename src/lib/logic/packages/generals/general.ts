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
				answer: [],
			},
		];
	}

	get words(): Word[] {
		return this.pages[this.currentPage].words;
	}

	get answer(): string[] {
		return this.pages[this.currentPage].answer;
	}
}

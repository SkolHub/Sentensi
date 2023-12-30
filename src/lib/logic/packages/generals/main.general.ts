import { LineModel, Word } from '../../models';
import { PageModel } from '@/lib/logic/packages/generals/models';

export abstract class MainGeneral {
	pages: PageModel[];
	currentPage: number = 0;
	_canvas: HTMLCanvasElement | undefined;
	_ctx: CanvasRenderingContext2D | undefined;

	protected constructor(pages?: PageModel[]) {
		this.pages = pages ?? [
			{
				words: [],
				lines: [],
				type: 'Remember and Write',
				answer: []
			},
		];
	}

	get words(): Word[] {
		return this.pages[this.currentPage].words;
	}

	get answer(): string[] {
		return this.pages[this.currentPage].answer;
	}

	get lines(): LineModel[] {
		return this.pages[this.currentPage].lines;
	}

	goToPage(page: number): number {
		return 1;
	}

	set canvas(canvas: HTMLCanvasElement) {
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d')!;
	}

	getClick(e: MouseEvent) {
		const rect = this._canvas!.getBoundingClientRect();

		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
	}

	abstract render(): void;
}

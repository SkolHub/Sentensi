import { LineModel, Word } from '../../models';
import { PageModel } from '@/lib/logic/packages/generals/models';

export abstract class MainGeneral {
	pages: PageModel[];
	currentPage: number = 0;
	_canvas!: HTMLCanvasElement;
	_ctx!: CanvasRenderingContext2D;

	protected constructor(pages?: PageModel[]) {
		this.pages = pages ?? [
			{
				words: [],
				lines: [],
				type: 'r&w',
				data: null,
				answer: []
			}
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

	get activityType(): 'l&w' | 'r&w' | 'r|w' {
		return this.pages[this.currentPage].type;
	}

	get activityData(): string | boolean | null {
		return this.pages[this.currentPage].data;
	}

	set canvas(canvas: HTMLCanvasElement) {
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d')!;
	}

	getClick(e: MouseEvent) {
		const rect = this._canvas.getBoundingClientRect();

		const zoom = window.devicePixelRatio;

		return {
			x: (e.clientX - rect.left) * zoom,
			y: (e.clientY - rect.top) * zoom
		};
	}

	abstract render(): void;

	export(): PageModel[] {
		for (const page of this.pages) {
			for (const line of page.lines) {
				let ptStr = '';

				for (const point of line.points) {
					ptStr += `${point.x} ${point.y} `;
				}

				line.points = ptStr.slice(0, -1) as any;
			}
		}

		return this.pages;
	}

	import(pages: PageModel[]) {
		this.pages = pages;

		for (const page of this.pages) {
			for (const line of page.lines) {
				let points = (line.points as any as string).split(' ');

				line.points = [];

				for (let i = 0; i < points.length; i += 2) {
					line.points.push({
						x: +points[i],
						y: +points[i + 1]
					});
				}
			}
		}
	}
}

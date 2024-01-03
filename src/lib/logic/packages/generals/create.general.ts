import { Point } from '@/lib/logic/models';
import { MainGeneral } from '@/lib/logic/packages/generals/main.general';
import { ActionType, PageModel } from '@/lib/logic/packages/generals/models';
import { CommonPackage } from '@/lib/logic/packages/common/common.package';
import { ToolsPackage } from '@/lib/logic/packages/tools/tools.package';
import { WordsPackage } from '@/lib/logic/packages/words/words.package';
import { DrawPackage } from '@/lib/logic/packages/drawing/draw.package';

export class CreateGeneral extends MainGeneral {
	action: ActionType = null;

	lastDrawPoint: Point = { x: 0, y: 0 };

	commonPkg: CommonPackage = new CommonPackage(this);
	toolsPkg: ToolsPackage = new ToolsPackage(this);
	wordsPkg: WordsPackage = new WordsPackage(this);
	drawPkg: DrawPackage = new DrawPackage(this);

	color!: string;

	constructor() {
		super();
	}

	clearPage() {
		this.pages[this.currentPage].words = [];
		this.pages[this.currentPage].lines = [];
		this.render();
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

	render() {
		this.commonPkg.clear();

		this.drawPkg.render();
		this.wordsPkg.render();
		this.toolsPkg.render();
	}

	export(): string {
		return JSON.stringify(this.pages);
	}
}

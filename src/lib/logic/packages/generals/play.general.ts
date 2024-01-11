import { MainGeneral } from '@/lib/logic/packages/generals/main.general';
import { CommonPackage } from '@/lib/logic/packages/common/common.package';
import { WordRenderPackage } from '@/lib/logic/packages/words/word-render.package';
import { DrawRenderPackage } from '@/lib/logic/packages/drawing/draw-render.package';

export class PlayGeneral extends MainGeneral {
	commonPkg: CommonPackage = new CommonPackage(this);
	wordsPkg: WordRenderPackage = new WordRenderPackage(this);
	drawPkg: DrawRenderPackage = new DrawRenderPackage(this);

	playerAnswer: string[] = [];

	constructor() {
		super();
	}

	render() {
		this.wordsPkg.render();
		this.drawPkg.render();
	}

	get type(): 'r&w' | 'l&w' | 'r|w' {
		return this.pages[this.currentPage].type;
	}


}

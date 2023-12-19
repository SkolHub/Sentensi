import { Action, ActionType, PageModel, Word } from './models';

class General {
	pages: PageModel[];

	words: Word[] = [{
		start: {
			x: 10,
			y: 10
		},
		control: {
			x: 20,
			y: 20
		},
		end: {
			x: 40,
			y: 40
		},
		color: {
			top: '#000000',
			bottom: '#000000'
		},
		content: 'Test',
		fontSize: 32,
		letterBoxes: []
	}];
	answer: string = '';
	type: ActionType = 'Remember and Write';

	_currentPage: number = 0;

	action: Action = { type: null, details: {} };

	constructor(pages?: PageModel[]) {
		this.pages = pages ?? [];
	}

	getCurrentPage() {
		return this._currentPage;
	}

	setCurrentPage(page: number) {
		this._currentPage = page;
	}

	changePage(page: number) {
		this._currentPage = page;
	}

	deleteCurrentPage() {
		if (this.pages.length > 1) {
			this.pages.splice(this._currentPage, 1);

			if (this._currentPage === this.pages.length) {
				this._currentPage--;
			}
		}
	}
}

export {
	General
};
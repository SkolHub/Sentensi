import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { RotateToolPackage } from '@/lib/logic/packages/tools/rotate-tool.package';
import { CreateGeneral } from '@/lib/logic/packages/generals/create.general';
import { ScaleToolPackage } from '@/lib/logic/packages/tools/scale-tool.package';
import { Point, Word } from '@/lib/logic/models';
import { SelectTool } from '@/lib/logic/packages/tools/select-tool.package';

class ToolsPackage extends SentensiPackage<CreateGeneral> {
	select: SelectTool = new SelectTool(this.general);
	scale: ScaleToolPackage = new ScaleToolPackage(this.general);
	rotate: RotateToolPackage = new RotateToolPackage(this.general);

	targets!: Word[];

	constructor(general: CreateGeneral) {
		super(general);
	}

	reset() {
		this.select.reset();
		this.scale.reset();
		this.rotate.reset();
	}

	render() {
		this.select.render();
		this.scale.render();
		this.rotate.render();
	}

	checkTools(point: Point): boolean {
		if (this.scale.initGroupScale(point)) {
			this.general.action = 'groupScale';

			this.rotate.reset();
			this.select.reset();

			return true;
		}

		if (this.rotate.iniGroupRotate(point)) {
			this.general.action = 'groupRotate';

			this.select.reset();
			this.scale.reset();

			return true;
		}

		if (this.select.initGroupMove(point)) {
			this.general.action = 'groupMove';

			this.reset();

			return true;
		}

		this.reset();

		return false;
	}

	selectArea(point: Point) {
		this.general.action = 'select';

		this.select.initSelect(point);
	}

	handleTools(point: Point): boolean {
		switch (this.general.action) {
			case 'select':
				this.select.handleSelect(point);

				return true;

			case 'groupMove':
				this.select.handleGroupMove(point);

				return true;

			case 'groupRotate':
				this.rotate.handleGroupRotate(point);

				return true;

			case 'groupScale':
				this.scale.handleGroupScale(point);

				return true;
		}

		return false;
	}

	finishTools(): boolean {
		switch (this.general.action) {
			case 'select':
				const selectedWords = this.select.finishSelect();

				if (selectedWords.length) {
					this.targets = selectedWords;

					this.rotate.state = {
						track: {
							x: this.select.state.x + this.select.state.width / 2,
							y: this.select.state.y + this.select.state.height / 2
						}
					};

					this.rotate.state = {
						thumb: {
							x: this.rotate.state.track.x,
							y: this.rotate.state.track.y - 60
						}
					};

					this.scale.state = {
						x: this.select.state.x + this.select.state.width,
						y: this.select.state.y + this.select.state.height
					};
				} else {
					this.reset();
				}

				return true;

			case 'groupRotate':
				this.rotate.reset();

				return true;

			case 'groupScale':
				this.scale.reset();

				return true;
		}

		return false;
	}
}

export { ToolsPackage };

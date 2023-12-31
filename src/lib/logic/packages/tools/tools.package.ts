import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { RotateToolPackage } from '@/lib/logic/packages/tools/rotate-tool.package';
import { CreateGeneral } from '@/lib/logic/packages/generals/create.general';
import { SelectTool } from '@/lib/logic/packages/tools/select-tool.package';
import { ScaleToolPackage } from '@/lib/logic/packages/tools/scale-tool.package';
import { Point, Word } from '@/lib/logic/models';
import {
	getMedium,
	groupRotateAngles,
	groupRotateLengths
} from '@/lib/logic/math';

class ToolsPackage extends SentensiPackage<CreateGeneral> {
	select: SelectTool;
	scale: ScaleToolPackage;
	rotate: RotateToolPackage;

	constructor(general: CreateGeneral) {
		super(general);

		this.select = new SelectTool(general);
		this.scale = new ScaleToolPackage(general);
		this.rotate = new RotateToolPackage(general);
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
		if (this.scale.activate(point)) {
			this.general.action = 'groupScale';

			/*this.general.details = {
				point: this.select.state,
				angle: getSlope(this.select.state, {
					x: this.select.state.x + this.select.state.width,
					y: this.select.state.y + this.select.state.height
				}),
				distance: pyth(this.select.state, {
					x: this.select.state.x + this.select.state.width,
					y: this.select.state.y + this.select.state.height
				}),
				length: this.scale.state.thumb.x + this.select.state.width,
				origins: this.general.details.target as Word[],
				target: this.general.details.target
			};

			this.scale.state = { ...this.scale.state };*/

			this.rotate.reset();
			this.select.reset();

			return true;
		}

		if (this.rotate.activate(point)) {
			this.general.action = 'groupRotate';

			this.general.details = {
				point: this.rotate.state.track,
				angles: groupRotateAngles(
					this.general.details.target as Word[],
					this.rotate.state.track
				),
				lengths: groupRotateLengths(
					this.general.details.target as Word[],
					this.rotate.state.track
				),
				target: this.general.details.target
			};

			this.select.reset();
			this.scale.reset();

			return true;
		}

		if (this.select.activate(point)) {
			this.general.action = 'groupMove';

			this.general.details.point = point;

			this.reset();

			return true;
		}

		this.reset();

		return false;
	}

	selectArea(point: Point): boolean {
		this.general.action = 'select';

		this.general.details.point = point;

		this.select.state = {
			x: point.x,
			y: point.y,
			width: 0,
			height: 0
		};

		return true;
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
				this.scale.handleGroupScale(point.x);

				return true;
		}

		return false;
	}

	finishTools(): boolean {
		switch (this.general.action) {
			case 'select':
				const selectedWords = this.select.finishSelect();

				if (selectedWords.length) {
					this.general.details.target = selectedWords;

					this.rotate.state = {
						track: getMedium(selectedWords)
					};

					this.rotate.state = {
						thumb: {
							x: this.rotate.state.track.x,
							y: this.rotate.state.track.y - 60
						}
					};

					this.scale.state = this.select.state;
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

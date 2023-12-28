import { SentensiPackage } from '@/lib/logic/sentensi-package';
import {
	HandleGroupRotateModel,
	RotateTool,
} from '@/lib/logic/packages/tools/rotate-tool';
import { CreateGeneral } from '@/lib/logic/packages/generals/create-general';
import {
	HandleGroupMoveModel,
	HandleSelectModel,
	SelectTool,
} from '@/lib/logic/packages/tools/select-tool';
import {
	HandleGroupScaleModel,
	ScaleTool,
} from '@/lib/logic/packages/tools/scale-tool';
import { Point, Word } from '@/lib/logic/models';
import {
	getMedium,
	getSlope,
	groupRotateAngles,
	groupRotateLengths,
	pyth,
} from '@/lib/logic/math';
import { handleGroupSelect } from '@/lib/logic/packages/words/word-handlers';

class Tools extends SentensiPackage<CreateGeneral> {
	select: SelectTool;
	scale: ScaleTool;
	rotate: RotateTool;

	constructor(canvas: HTMLCanvasElement, general: CreateGeneral) {
		super(canvas, general);

		this.select = new SelectTool(this.ctx);
		this.scale = new ScaleTool(this.ctx);
		this.rotate = new RotateTool(this.ctx);
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

			this.general.details = {
				point: this.select.state,
				angle: getSlope(this.select.state, {
					x: this.select.state.x + this.select.state.width,
					y: this.select.state.y + this.select.state.height,
				}),
				distance: pyth(this.select.state, {
					x: this.select.state.x + this.select.state.width,
					y: this.select.state.y + this.select.state.height,
				}),
				length: this.scale.state.thumb.x + this.select.state.width,
				origins: this.general.details.target as Word[],
				target: this.general.details.target,
			};

			this.scale.state = { ...this.scale.state };

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
					this.rotate.state.track,
				),
				lengths: groupRotateLengths(
					this.general.details.target as Word[],
					this.rotate.state.track,
				),
				target: this.general.details.target,
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
			height: 0,
		};

		return true;
	}

	handleTools(point: Point): boolean {
		switch (this.general.action) {
			case 'select':
				this.select.handleSelect(
					this.general.details as HandleSelectModel,
					point,
				);

				return true;

			case 'groupMove':
				this.select.handleGroupMove(
					this.general.details as HandleGroupMoveModel,
					point,
				);

				return true;

			case 'groupRotate':
				this.rotate.handleGroupRotate(
					this.general.details as HandleGroupRotateModel,
					point,
				);

				return true;

			case 'groupScale':
				this.scale.handleGroupScale(
					this.general.details as HandleGroupScaleModel,
					point.x,
				);

				return true;
		}

		return false;
	}

	finishTools(): boolean {
		switch (this.general.action) {
			case 'select':
				const selectedWords = handleGroupSelect(
					this.general.words,
					this.select.state,
				);

				if (selectedWords.length) {
					this.general.details.target = selectedWords;

					this.rotate.state = {
						track: getMedium(selectedWords),
					};

					this.rotate.state = {
						thumb: {
							x: this.rotate.state.track.x,
							y: this.rotate.state.track.y - 60,
						},
					};

					this.scale.state = {
						thumb: {
							x: this.select.state.x + this.select.state.width,
							y: this.select.state.y + this.select.state.height,
						},
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

export { Tools };

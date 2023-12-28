import { Point, Word } from '@/lib/logic/models';
import { Tool } from '@/lib/logic/packages/tools/tool';
import { contained } from '@/lib/logic/math';

interface SelectToolModel {
	x: number;
	y: number;
	width: number;
	height: number;
}

const InitialSelectTool: SelectToolModel = {
	x: -100,
	y: -100,
	width: 0,
	height: 0,
};

export interface HandleSelectModel {
	point: Point;
}

export interface HandleGroupMoveModel {
	target: Word[];
	point: Point;
}

export class SelectTool extends Tool<SelectToolModel> {
	static readonly BOX_BORDER_COLOR = '#004B88';
	static readonly BOX_COLOR = 'rgba(0,75,136,0.2)';
	static readonly BOX_BORDER_WIDTH = 1;

	static readonly CORNER_COLOR = '#FFFFFF';

	constructor(ctx: CanvasRenderingContext2D) {
		super(InitialSelectTool, ctx);
	}

	render() {
		this.ctx.strokeStyle = SelectTool.BOX_BORDER_COLOR;
		this.ctx.fillStyle = SelectTool.BOX_COLOR;
		this.ctx.lineWidth = SelectTool.BOX_BORDER_WIDTH;

		this.ctx.beginPath();
		this.ctx.rect(
			this.state.x,
			this.state.y,
			this.state.width,
			this.state.height,
		);

		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.fillStyle = SelectTool.CORNER_COLOR;

		this.renderSelectSquare(this.state.x, this.state.y);
		this.renderSelectSquare(this.state.x + this.state.width, this.state.y);
		this.renderSelectSquare(this.state.x, this.state.y + this.state.height);
		this.renderSelectSquare(
			this.state.x + this.state.width,
			this.state.y + this.state.height,
		);
	}

	handleSelect(details: HandleSelectModel, point: Point) {
		this.state = {
			x: Math.min(details.point.x, point.x),
			y: Math.min(details.point.y, point.y),
			width: Math.abs(details.point.x - point.x),
			height: Math.abs(details.point.y - point.y),
		};
	}

	handleGroupMove(details: HandleGroupMoveModel, point: Point) {
		for (const word of details.target) {
			word.start.x += point.x - details.point.x;
			word.start.y += point.y - details.point.y;
		}

		details.point = point;
	}

	activate(point: Point): boolean {
		return contained(
			point,
			this.state.x,
			this.state.y,
			this.state.width,
			this.state.height,
		);
	}

	private renderSelectSquare(x: number, y: number) {
		this.ctx.beginPath();

		this.ctx.rect(x - 5, y - 5, 10, 10);

		this.ctx.fill();
		this.ctx.stroke();
	}
}

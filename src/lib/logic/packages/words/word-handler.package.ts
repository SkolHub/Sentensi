import { Point, Word } from '../../models';
import { getPointOnCircle, getSlope, pyth } from '@/lib/logic/math';
import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { CreateGeneral } from '@/lib/logic/packages/generals/create.general';
import {
	stretchAngle,
	stretchLength
} from '@/lib/logic/packages/words/word-math';

export class WordHandlerPackage extends SentensiPackage<CreateGeneral> {
	target!: Word;
	point!: Point;

	radius!: number;
	mid!: Point;

	textLength!: number;
	baseLength!: number;
	angle!: number;

	constructor(general: CreateGeneral) {
		super(general);
	}

	initMove(target: Word, point: Point) {
		this.target = target;
		this.point = point;
	}

	handleMove(cursor: Point): void {
		this.target.start.x += cursor.x - this.point.x;
		this.target.start.y += cursor.y - this.point.y;

		this.point = cursor;
	}

	initBend(target: Word) {
		this.target = target;

		this.radius = pyth(target.end) / 1.5;
		this.mid = {
			x: target.end.x / 2,
			y: target.end.y / 2
		};
	}

	handleBend(cursor: Point): void {
		if (
			pyth(this.mid, {
				x: cursor.x - this.target.start.x,
				y: cursor.y - this.target.start.y
			}) < this.radius
		) {
			this.target.control.x = cursor.x - this.target.start.x;
			this.target.control.y = cursor.y - this.target.start.y;
		} else {
			this.target.control = getPointOnCircle(
				this.radius,
				getSlope(this.mid, {
					x: cursor.x - this.target.start.x,
					y: cursor.y - this.target.start.y
				}),
				this.mid
			);
		}
	}

	initStretchOrScale(target: Word, point: Point) {
		this.target = target;
		this.point = point;

		this.textLength = this.measure(target.content, target.fontSize).width;
		this.baseLength = this.measure(target.content, 64).width;
		this.radius = stretchLength(target);
		this.angle = stretchAngle(target);
	}

	handleStretch(cursor: Point): void {
		if (pyth(this.target.start, cursor) > this.textLength) {
			this.target.end.x = cursor.x - this.target.start.x;
			this.target.end.y = cursor.y - this.target.start.y;
		} else {
			this.target.end = getPointOnCircle(
				this.textLength,
				getSlope(this.target.start, cursor)
			);
		}

		this.target.control = getPointOnCircle(
			this.radius * pyth(this.target.end),
			getSlope({ x: 0, y: 0 }, this.target.end) - this.angle
		);
	}

	handleScale(cursor: Point): void {
		this.handleStretch(cursor);

		this.target.fontSize = (pyth(this.target.end) / this.baseLength) * 64;
	}
}

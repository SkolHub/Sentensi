import { Point, SelectBox, Word } from '../../models';
import {
	contained,
	getPointOnCircle,
	getSlope,
	getXOnCircle,
	getYOnCircle,
	pyth,
} from '@/lib/logic/math';

export interface HandleMoveModel {
	target: Word;
	point: Point;
}

export const handleMove = (details: HandleMoveModel, point: Point) => {
	details.target.start.x += point.x - details.point.x;
	details.target.start.y += point.y - details.point.y;

	details.point = point;
};

export interface HandleBendModel {
	target: Word;
}

export const handleBend = (details: HandleBendModel, point: Point) => {
	const mid: Point = {
			x: details.target.end.x / 2,
			y: details.target.end.y / 2,
		},
		radius = pyth(details.target.end) / 1.5;

	if (
		pyth(mid, {
			x: point.x - details.target.start.x,
			y: point.y - details.target.start.y,
		}) < radius
	) {
		details.target.control.x = point.x - details.target.start.x;
		details.target.control.y = point.y - details.target.start.y;
	} else {
		const ang = getSlope(mid, {
			x: point.x - details.target!.start.x,
			y: point.y - details.target!.start.y,
		});

		details.target.control.x = getXOnCircle(mid.x, radius, ang);
		details.target.control.y = getYOnCircle(mid.y, radius, -ang);
	}
};

export interface HandleStretchModel {
	target: Word;
	length: number;
	angle: number;
}

export const handleStretch = (
	details: HandleStretchModel,
	point: Point,
	scale: boolean,
	textLength: number,
) => {
	if (pyth(details.target.start, point) > textLength) {
		details.target.end.x = point.x - details.target.start.x;
		details.target.end.y = point.y - details.target.start.y;
	} else {
		details.target.end = getPointOnCircle(
			{ x: 0, y: 0 },
			textLength,
			-getSlope(details.target.start, point),
		);
	}

	details.target.control = getPointOnCircle(
		{ x: 0, y: 0 },
		details.length! * pyth(details.target.end),
		-getSlope({ x: 0, y: 0 }, details.target.end) + details.angle!,
	);

	if (scale) {
		details.target.fontSize = (pyth(details.target.end) / textLength) * 64;
	}
};

export const handleGroupSelect = (
	words: Word[],
	selectBox: SelectBox,
): Word[] => {
	return words.filter(
		(word) =>
			contained(
				word.start,
				selectBox.x,
				selectBox.y,
				selectBox.width,
				selectBox.height,
			) ||
			contained(
				{
					x: word.start.x + word.control.x,
					y: word.start.y + word.control.y,
				},
				selectBox.x,
				selectBox.y,
				selectBox.width,
				selectBox.height,
			) ||
			contained(
				{
					x: word.start.x + word.end.x,
					y: word.start.y + word.end.y,
				},
				selectBox.x,
				selectBox.y,
				selectBox.width,
				selectBox.height,
			),
	);
};

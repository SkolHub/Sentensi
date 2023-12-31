import { Point, Word } from '../../models';
import { getPointOnBezier, getSlope, pyth } from '@/lib/logic/math';

export const splitBezierIntoLengths = (
	start: Point,
	control: Point,
	end: Point,
	precision: number
) => {
	const lengths = [];
	let totalLength = 0;

	let prev = getPointOnBezier(start, control, end, 0);

	for (let i = 1; i <= precision; ++i) {
		let point = getPointOnBezier(start, control, end, i / precision);

		lengths.push(pyth(prev, point));
		prev = point;

		totalLength += lengths[i - 1];
	}

	return {
		totalLength,
		lengths
	};
};

export const getPosAndAngle = (
	start: Point,
	control: Point,
	end: Point,
	t1: number,
	t2: number
) => {
	const P1 = getPointOnBezier(start, control, end, t1);
	const P2 = getPointOnBezier(start, control, end, t2);

	if (P2.y <= P1.y && P2.x <= P1.x) {
		return {
			ang: Math.atan((P1.y - P2.y) / (P1.x - P2.x)) + Math.PI,
			pos: P1
		};
	}

	if (P2.y >= P1.y && P2.x <= P1.x) {
		return {
			ang: Math.atan((P1.y - P2.y) / (P1.x - P2.x)) + Math.PI,
			pos: P1
		};
	}

	return {
		ang: Math.atan((P1.y - P2.y) / (P1.x - P2.x)),
		pos: P1
	};
};

export const stretchAngle = (word: Word): number => {
	return getSlope({x: 0, y: 0}, word.end) - getSlope({x: 0, y: 0}, word.control);
};

export const stretchLength = (word: Word): number => {
	return Math.sqrt(
		(word.control.x ** 2 + word.control.y ** 2) /
			(word.end.x ** 2 + word.end.y ** 2)
	);
};

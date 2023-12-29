import { Point, Word } from './models';

const pyth = (P1: Point, P2: Point = { x: 0, y: 0 }): number => {
	return Math.sqrt((P2.x - P1.x) ** 2 + (P2.y - P1.y) ** 2);
};

const getPointOnBezier = (
	start: Point,
	control: Point,
	end: Point,
	time: number,
): Point => {
	return {
		x:
			(1 - time) ** 2 * start.x +
			2 * (1 - time) * time * control.x +
			time ** 2 * end.x,
		y:
			(1 - time) ** 2 * start.y +
			2 * (1 - time) * time * control.y +
			time ** 2 * end.y,
	};
};

const getPointOnCircle = (
	origin: Point,
	radius: number,
	angle: number,
): Point => {
	return {
		x: origin.x + radius * Math.cos(angle),
		y: origin.y + radius * Math.sin(angle),
	};
};

const getXOnCircle = (
	origin: number,
	radius: number,
	angle: number,
): number => {
	return origin + radius * Math.cos(angle);
};

const getYOnCircle = (
	origin: number,
	radius: number,
	angle: number,
): number => {
	return origin + radius * Math.sin(angle);
};

const checkPointSide = (P: Point, P1: Point, P2: Point): boolean => {
	return (P2.x - P1.x) * (P.y - P1.y) - (P.x - P1.x) * (P2.y - P1.y) > 0;
};

const stretchAngle = (word: Word): number => {
	return (
		getSlope({ x: 0, y: 0 }, word.end) - getSlope({ x: 0, y: 0 }, word.control)
	);
};

const stretchLength = (word: Word): number => {
	return Math.sqrt(
		(word.control.x ** 2 + word.control.y ** 2) /
			(word.end.x ** 2 + word.end.y ** 2),
	);
};

const getSlope = (A: Point, B: Point) => {
	const slope = -Math.atan((A.y - B.y) / (A.x - B.x));

	if (B.y <= A.y && B.x <= A.x) {
		return slope + Math.PI;
	}

	if (B.y >= A.y && B.x <= A.x) {
		return slope - Math.PI;
	}

	return slope;
};

const contained = (
	P: Point,
	x: number,
	y: number,
	w: number,
	h: number,
): boolean => {
	return P.x >= x && P.x <= x + w && P.y >= y && P.y <= y + h;
};

const getMedium = (words: Word[]): Point => {
	let x = 0,
		y = 0;
	for (let word of words) {
		x += word.start.x * 3 + word.control.x + word.end.x;
		y += word.start.y * 3 + word.control.y + word.end.y;
	}

	return {
		x: x / words.length / 3,
		y: y / words.length / 3,
	};
};

const groupRotateAngles = (
	words: Word[],
	origin: Point,
): { startAngle: number; focusAngle: number; endAngle: number }[] => {
	return words.map((word) => ({
		startAngle: -getSlope(origin, word.start),
		focusAngle: -getSlope(origin, {
			x: word.start.x + word.control.x,
			y: word.start.y + word.control.y,
		}),
		endAngle: -getSlope(origin, {
			x: word.start.x + word.end.x,
			y: word.start.y + word.end.y,
		}),
	}));
};

const groupRotateLengths = (
	words: Word[],
	origin: Point,
): { startDistance: number; focusDistance: number; endDistance: number }[] => {
	return words.map((word) => ({
		startDistance: pyth(origin, word.start),
		focusDistance: pyth(origin, {
			x: word.start.x + word.control.x,
			y: word.start.y + word.control.y,
		}),
		endDistance: pyth(origin, {
			x: word.start.x + word.end.x,
			y: word.start.y + word.end.y,
		}),
	}));
};

export {
	pyth,
	getPointOnBezier,
	getPointOnCircle,
	checkPointSide,
	stretchAngle,
	stretchLength,
	getSlope,
	getXOnCircle,
	getYOnCircle,
	contained,
	getMedium,
	groupRotateAngles,
	groupRotateLengths,
};
import { Point, Word } from './models';

const pyth = (P1: Point, P2: Point = { x: 0, y: 0 }): number => {
	return Math.sqrt((P2.x - P1.x) ** 2 + (P2.y - P1.y) ** 2);
};

const getPointOnBezier = (
	start: Point,
	control: Point,
	end: Point,
	time: number
): Point => {
	return {
		x:
			(1 - time) ** 2 * start.x +
			2 * (1 - time) * time * control.x +
			time ** 2 * end.x,
		y:
			(1 - time) ** 2 * start.y +
			2 * (1 - time) * time * control.y +
			time ** 2 * end.y
	};
};

const getPointOnCircle = (
	radius: number,
	angle: number,
	origin: Point = { x: 0, y: 0 }
): Point => {
	return {
		x: origin.x + radius * Math.cos(angle),
		y: origin.y + radius * Math.sin(angle)
	};
};

const getXOnCircle = (
	origin: number,
	radius: number,
	angle: number
): number => {
	return origin + radius * Math.cos(angle);
};

const getYOnCircle = (
	origin: number,
	radius: number,
	angle: number
): number => {
	return origin + radius * Math.sin(angle);
};

const checkPointSide = (P: Point, P1: Point, P2: Point): boolean => {
	return (P2.x - P1.x) * (P.y - P1.y) - (P.x - P1.x) * (P2.y - P1.y) > 0;
};

const getSlope = (A: Point, B: Point) => {
	return Math.atan2(A.y - B.y, A.x - B.x) + Math.PI;
};

const contained = (
	P: Point,
	x: number,
	y: number,
	w: number,
	h: number
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
		y: y / words.length / 3
	};
};

const groupRotateAngles = (
	words: Word[],
	origin: Point
): { start: number; control: number; end: number }[] => {
	return words.map((word) => ({
		start: getSlope(origin, word.start),
		control: getSlope(origin, {
			x: word.start.x + word.control.x,
			y: word.start.y + word.control.y
		}),
		end: getSlope(origin, {
			x: word.start.x + word.end.x,
			y: word.start.y + word.end.y
		})
	}));
};

const groupRotateLengths = (
	words: Word[],
	origin: Point
): { start: number; control: number; end: number }[] => {
	return words.map((word) => ({
		start: pyth(origin, word.start),
		control: pyth(origin, {
			x: word.start.x + word.control.x,
			y: word.start.y + word.control.y
		}),
		end: pyth(origin, {
			x: word.start.x + word.end.x,
			y: word.start.y + word.end.y
		})
	}));
};

const segmentsIntersect = (
	p1: Point,
	p2: Point,
	p3: Point,
	p4: Point
): boolean => {
	return (
		ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4)
	);
};

const ccw = (p1: Point, p2: Point, p3: Point): boolean => {
	return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
};

const pointToLineDistance = (
	point: Point,
	lineStart: Point,
	lineEnd: Point
): number => {
	const { x, y } = point;
	const { x: x1, y: y1 } = lineStart;
	const { x: x2, y: y2 } = lineEnd;

	const A = x - x1;
	const B = y - y1;
	const C = x2 - x1;
	const D = y2 - y1;

	const dot = A * C + B * D;
	const lenSq = C * C + D * D;

	let xx, yy;

	if (lenSq === 0) {
		xx = x1;
		yy = y1;
	} else {
		const param = dot / lenSq;

		if (param < 0) {
			xx = x1;
			yy = y1;
		} else if (param > 1) {
			xx = x2;
			yy = y2;
		} else {
			xx = x1 + param * C;
			yy = y1 + param * D;
		}
	}

	const dx = x - xx;
	const dy = y - yy;

	return Math.sqrt(dx * dx + dy * dy);
};

export {
	pyth,
	getPointOnBezier,
	getPointOnCircle,
	checkPointSide,
	getSlope,
	getXOnCircle,
	getYOnCircle,
	contained,
	getMedium,
	groupRotateAngles,
	groupRotateLengths,
	segmentsIntersect,
	pointToLineDistance
};

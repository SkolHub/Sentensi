import {
	contained,
	getPointOnCircle,
	getSlope,
	getXOnCircle,
	getYOnCircle,
	pyth
} from './math';
import { Point, SelectBox, Word } from './models';

const handleMove = (
	details: { target?: Word; x?: number; y?: number },
	x: number,
	y: number
) => {
	details.target!.start.x += x - details.x!;
	details.target!.start.y += y - details.y!;

	details!.x = x;
	details!.y = y;
};

const handleBend = (details: { target?: Word }, x: number, y: number) => {
	const mid: Point = {
			x: details.target!.end.x / 2,
			y: details.target!.end.y / 2
		},
		radius = pyth(details.target!.end) / 1.5;

	if (
		pyth(mid, {
			x: x - details.target!.start.x,
			y: y - details.target!.start.y
		}) < radius
	) {
		details.target!.control.x = x - details.target!.start.x;
		details.target!.control.y = y - details.target!.start.y;
	} else {
		const ang = getSlope(mid, {
			x: x - details.target!.start.x,
			y: y - details.target!.start.y
		});
		details.target!.control.x = getXOnCircle(mid.x, radius, ang);
		details.target!.control.y = getYOnCircle(mid.y, radius, -ang);
	}
};

const handleStretch = (
	details: { target?: Word; length?: number; angle?: number },
	x: number,
	y: number,
	scale: boolean,
	textLength: number
) => {
	if (pyth(details.target!.start, { x, y }) > textLength) {
		details.target!.end.x = x - details.target!.start.x;
		details.target!.end.y = y - details.target!.start.y;
	} else {
		details.target!.end = getPointOnCircle(
			{ x: 0, y: 0 },
			textLength,
			-getSlope(details.target!.start, { x, y })
		);
	}

	details.target!.control = getPointOnCircle(
		{ x: 0, y: 0 },
		details.length! * pyth(details.target!.end),
		-getSlope({ x: 0, y: 0 }, details.target!.end) + details.angle!
	);

	if (scale) {
		details.target!.fontSize = (pyth(details.target!.end) / textLength) * 64;
	}
};

const handleSelectBox = (
	details: { x?: number; y?: number },
	x: number,
	y: number
): SelectBox => {
	return {
		x: Math.min(details.x!, x),
		y: Math.min(details.y!, y),
		width: Math.abs(details.x! - x),
		height: Math.abs(details.y! - y)
	};
};

const handleGroupSelect = (words: Word[], selectBox: SelectBox): Word[] => {
	return words.filter(
		(word) =>
			contained(
				word.start,
				selectBox.x,
				selectBox.y,
				selectBox.width,
				selectBox.height
			) ||
			contained(
				{
					x: word.start.x + word.control.x,
					y: word.start.y + word.control.y
				},
				selectBox.x,
				selectBox.y,
				selectBox.width,
				selectBox.height
			) ||
			contained(
				{
					x: word.start.x + word.end.x,
					y: word.start.y + word.end.y
				},
				selectBox.x,
				selectBox.y,
				selectBox.width,
				selectBox.height
			)
	);
};

const handleGroupMove = (
	details: { targets?: Word[]; x?: number; y?: number },
	x: number,
	y: number
) => {
	for (const word of details.targets!) {
		word.start.x += x - details.x!;
		word.start.y += y - details.y!;
	}

	details!.x = x;
	details!.y = y;
};

const handleGroupRotate = (
	details: {
		targets?: Word[];
		x?: number;
		y?: number;
		lengths?: {
			startDistance: number;
			focusDistance: number;
			endDistance: number;
		}[];
		angles?: { startAngle: number; focusAngle: number; endAngle: number }[];
	},
	x: number,
	y: number
): Point => {
	let ang = -getSlope(
		{
			x: details.x!,
			y: details.y!
		},
		{
			x,
			y
		}
	);

	const origin = getPointOnCircle(
		{
			x: details.x!,
			y: details.y!
		},
		60,
		ang
	);

	ang += Math.PI / 2;

	details.targets!.forEach((word, index) => {
		const x = getXOnCircle(
			details.x!,
			details.lengths![index].startDistance,
			details.angles![index].startAngle + ang
		);

		const y = getYOnCircle(
			details.y!,
			details.lengths![index].startDistance,
			details.angles![index].startAngle + ang
		);

		word.start.x = x;
		word.start.y = y;
		word.control.x =
			getXOnCircle(
				details.x!,
				details.lengths![index].focusDistance,
				details.angles![index].focusAngle + ang
			) - x;
		word.control.y =
			getYOnCircle(
				details.y!,
				details.lengths![index].focusDistance,
				details.angles![index].focusAngle + ang
			) - y;
		word.end.x =
			getXOnCircle(
				details.x!,
				details.lengths![index].endDistance,
				details.angles![index].endAngle + ang
			) - x;
		word.end.y =
			getYOnCircle(
				details.y!,
				details.lengths![index].endDistance,
				details.angles![index].endAngle + ang
			) - y;
	});

	return origin;
};

const handleGroupScale = (
	details: {
		targets?: Word[];
		x?: number;
		y?: number;
		distance?: number;
		length?: number;
		angle?: number;
		origins?: {
			start: {
				x: number;
				y: number;
			};
			control: {
				x: number;
				y: number;
			};
			end: {
				x: number;
				y: number;
			};
			fontSize: number;
		}[];
	},
	x: number
): Point | undefined => {
	const radius =
			details.distance! + (x - details.length!) / Math.cos(details.angle!),
		mod = (radius / details.distance!) * 2;

	for (const word of details.origins!) {
		if (word.fontSize * mod < 55.59) {
			return;
		}
	}

	details.targets!.forEach((word, index) => {
		word.start.x =
			(details.origins![index].start.x - details.x!) * mod + details.x!;
		word.start.y =
			(details.origins![index].start.y - details.y!) * mod + details.y!;
		word.control.x = details.origins![index].control.x * mod;
		word.control.y = details.origins![index].control.y * mod;
		word.end.x = details.origins![index].end.x * mod;
		word.end.y = details.origins![index].end.y * mod;
		word.fontSize = details.origins![index].fontSize * mod;
	});

	return {
		x: getXOnCircle(details.x!, radius, -details.angle!) - 5,
		y: getYOnCircle(details.y!, radius, -details.angle!) - 5
	};
};

export {
	handleMove,
	handleBend,
	handleStretch,
	handleSelectBox,
	handleGroupSelect,
	handleGroupMove,
	handleGroupRotate,
	handleGroupScale
};

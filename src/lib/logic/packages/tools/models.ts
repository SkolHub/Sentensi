import { Point, Word } from '@/lib/logic/models';

export interface RotateToolModel {
	thumb: {
		x: number;
		y: number;
	};
	track: {
		x: number;
		y: number;
	};
}

export interface HandleGroupRotateModel {
	target: Word[];
	point: Point;
	lengths: {
		startDistance: number;
		focusDistance: number;
		endDistance: number;
	}[];
	angles: { startAngle: number; focusAngle: number; endAngle: number }[];
}

export type ScaleToolModel = {
	x: number,
	y: number,
	width: number,
	height: number
};

export interface HandleGroupScaleModel {
	targets: Word[];
	point: Point;
	distance: number;
	length: number;
	angle: number;
	origins: {
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
}

export interface SelectToolModel {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface HandleSelectModel {
	point: Point;
}

export interface HandleGroupMoveModel {
	target: Word[];
	point: Point;
}

export type Subset<T> = {
	[K in keyof T]?: T[K];
};
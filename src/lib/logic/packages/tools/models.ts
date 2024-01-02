import { Point } from '@/lib/logic/models';

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

export type ScaleToolModel = Point;

export interface SelectToolModel {
	x: number;
	y: number;
	width: number;
	height: number;
}

export type Subset<T> = {
	[K in keyof T]?: T[K];
};

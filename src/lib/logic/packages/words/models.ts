import { Point, Word } from '@/lib/logic/models';

export interface HandleMoveModel {
	target: Word;
	point: Point;
}

export interface HandleBendModel {
	target: Word;
}

export interface HandleStretchModel {
	target: Word;
	length: number;
	angle: number;
}
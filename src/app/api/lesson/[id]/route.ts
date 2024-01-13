import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	return NextResponse.json(
		await prisma.lesson.findUnique({
			where: {
				id: +req.nextUrl.href.split('/').at(-1)!
			},
			include: {
				content: true
			}
		})
	);
}

export async function DELETE(req: NextRequest) {
	return NextResponse.json(
		await prisma.lesson.delete({
			where: {
				id: +req.nextUrl.href.split('/').at(-1)!
			},
			include: {
				content: true
			}
		})
	);
}

export async function POST(req: NextRequest) {
	const { data, name, label } = await req.json();
	
	return NextResponse.json(
		await prisma.lesson.update({
			where: {
				id: +req.nextUrl.href.split('/').at(-1)!
			},
			data: {
				name,
				label,
				content: {
					update: {
						data
					}
				}
			}
		})
	);
}

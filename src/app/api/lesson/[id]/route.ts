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

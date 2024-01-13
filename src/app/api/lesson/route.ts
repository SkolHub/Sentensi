import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { data, name, label } = await req.json();

	try {
		await prisma.lesson.create({
			data: {
				name,
				label,
				content: {
					create: {
						data
					}
				}
			}
		});

		return NextResponse.json({
			status: 200
		});
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to get ' },
			{
				status: 500
			}
		);
	}
}

export async function GET(_req: NextRequest) {
	return NextResponse.json(await prisma.lesson.findMany());
}
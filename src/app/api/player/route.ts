import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
	const { name, result, lessonID } = await req.json();

	try {
		await prisma.lessonSubmission.create({
			data: {
				name,
				result,
				lessonID: +lessonID
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
	return NextResponse.json(await prisma.lessonSubmission.findMany());
}

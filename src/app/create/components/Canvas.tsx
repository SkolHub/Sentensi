'use client';

import useCreateCanvas from '@/app/create/components/useCreateCanvas';
import { useContext } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';

const Canvas = () => {
	const { canvasRef } = useCreateCanvas();

	const { pen, eraser } = useContext(CreateContext)!;

	return <canvas className={`canvas section ${eraser ? 'eraser' : (pen ? 'pen' : '')}`} ref={canvasRef} />;
};

export default Canvas;

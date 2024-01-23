import useCreateCanvas from '@/app/create/components/useCreateCanvas';
import { useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';

const Canvas = () => {
	const canvasRef = useCreateCanvas();

	const { pen, eraser, expanded } = useContext(CreateContext)!;

	return useMemo(
		() => (
			<canvas
				className={`canvas section ${expanded ? '!h-[60%]' : ''} ${
					eraser ? 'eraser' : pen ? 'pen' : ''
				}`}
				ref={canvasRef}
			/>
		),
		[pen, eraser, expanded]
	);
};

export default Canvas;

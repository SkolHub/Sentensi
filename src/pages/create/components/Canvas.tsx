import { useContext } from 'react';
import useCreateCanvas from '../../../hooks/useCreateCanvas';
import { CreateContext } from './CreateContext';

const Canvas = () => {
	const { color, doubleColor, sizingMode, generalRef } = useContext(CreateContext)!;

	const { canvasRef } = useCreateCanvas(color, doubleColor, sizingMode, generalRef);

	return <canvas className='canvas section' ref={canvasRef} />;
};

export default Canvas;
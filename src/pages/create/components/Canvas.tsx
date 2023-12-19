import { MutableRefObject } from 'react';
import { General } from '../../../logic/general.ts';
import useCanvas from '../../../hooks/useCanvas.tsx';

const Canvas = (props: {
	color: string;
	doubleColor: boolean;
	sizingMode: 'stretch' | 'scale';
	generalRef: MutableRefObject<General>;
}) => {
	const { color, doubleColor, sizingMode, generalRef } = props;

	const { canvasRef } = useCanvas(color, doubleColor, sizingMode, generalRef);

	return <canvas className="canvas" ref={canvasRef} />;
};

export default Canvas;
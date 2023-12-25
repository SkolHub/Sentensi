import { useRef } from 'react';

const Play = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	return <canvas className='canvas' ref={canvasRef} />;
};

export default Play;
import useCreateCanvas from '@/app/create/components/useCreateCanvas';

const Canvas = () => {
	const { canvasRef } = useCreateCanvas();

	return <canvas className="canvas section" ref={canvasRef} />;
};

export default Canvas;

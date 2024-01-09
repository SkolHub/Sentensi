import usePlayCanvas from '@/app/play/components/usePlayCanvas';
import { useMemo } from 'react';

export default () => {
	const canvasRef = usePlayCanvas();

	return useMemo(
		() => <canvas className='canvas section' ref={canvasRef} />,
		[]
	);
};

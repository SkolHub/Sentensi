import Canvas from './components/Canvas.tsx';
import { useRef, useState } from 'react';
import { General } from '../../logic/general.ts';

const Create = () => {
	const [color, _setColor] = useState<string>('#000000');
	const [doubleColor, _setDoubleColor] = useState<boolean>(false);
	const [sizingMode, _setSizingMode] = useState<'stretch' | 'scale'>('stretch');

	const generalRef = useRef<General>(new General());

	return <Canvas color={color} doubleColor={doubleColor} sizingMode={sizingMode} generalRef={generalRef} />;
};

export default Create;
import { useContext, useMemo } from 'react';
import { TextBoxContext } from '@/lib/contexts/TextBoxContext';
import { PlayContext } from '@/app/play/components/PlayContext';

const defaultFontSize = 2;

export default () => {
	const { generalRef } = useContext(PlayContext)!;

	const zoom = useContext(TextBoxContext)!;

	return useMemo(
		() => (
			<div className='section text-box'>
				{generalRef.current.answer.map((word: string, index: number) => (
					<span
						style={{
							fontSize: `${(defaultFontSize / zoom) * 31}px`,
							paddingLeft:
								index === 0 || word[0] !== '\x80'
									? `${(defaultFontSize / 2 / zoom) * 31}px`
									: ''
						}}
						key={index}
					>
						{word.replace('\x80', '')}
					</span>
				))}
			</div>
		),
		[]
	);
};

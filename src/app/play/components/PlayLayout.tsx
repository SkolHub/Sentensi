'use client';

import { useContext, useMemo } from 'react';
import PlayTextBox from '@/app/play/components/PlayTextBox';
import ResultsSection from '@/app/play/components/play-side-bar/ResultsSection';
import Canvas from '@/app/play/components/Canvas';
import NavigationSection from '@/app/play/components/play-side-bar/NavigationSection';
import { PlayContext } from '@/app/play/components/PlayContext';
import RightOrWrongSection from '@/app/play/components/play-side-bar/RightOrWrongSection';
import PunctuationSection from '@/app/play/components/play-side-bar/PunctuationSection';
import AudioSection from '@/app/play/components/play-side-bar/AudioSection';

export default () => {
	const { status, generalRef, updater } = useContext(PlayContext)!;

	return useMemo(
		() => (
			<div className='w-screen h-screen flex box-border gap-2.5 overflow-hidden p-2.5 bg-[#97c8ff]'>
				<div className='board'>
					<Canvas />
					<PlayTextBox />
				</div>
				<div className='side-bar'>
					<ResultsSection />
					{status !== 'solve' ? (
						''
					) : generalRef.current.type === 'r|w' ? (
						<RightOrWrongSection />
					) : (
						<PunctuationSection />
					)}
					{status === 'solve' && generalRef.current.type === 'l&w' ? (
						<AudioSection />
					) : (
						''
					)}
					<NavigationSection />
				</div>
			</div>
		),
		[status, updater]
	);
};

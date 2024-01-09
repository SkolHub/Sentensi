'use client';

import { useMemo } from 'react';
import PlayTextBox from '@/app/play/components/PlayTextBox';
import ResultsSection from '@/app/play/components/play-side-bar/ResultsSection';
import PunctuationSection from '@/app/play/components/play-side-bar/PunctuationSection';
import Canvas from '@/app/play/components/Canvas';
import NavigationSection from '@/app/play/components/play-side-bar/NavigationSection';

export default () => {
	return useMemo(
		() => (
			<div className='w-screen h-screen flex box-border gap-2.5 overflow-hidden p-2.5 bg-[#97c8ff]'>
				<div className='board'>
					<Canvas />
					<PlayTextBox />
				</div>
				<div className='side-bar'>
					<ResultsSection />
					<PunctuationSection />
					<NavigationSection />
				</div>
			</div>
		),
		[]
	);
};

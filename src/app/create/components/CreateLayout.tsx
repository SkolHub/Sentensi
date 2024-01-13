'use client';

import { useContext, useEffect, useMemo } from 'react';
import Canvas from './Canvas';
import { CreateContext } from './CreateContext';
import ColorSection from '@/app/create/components/canvas-maker-side-bar/ColorSection';
import CustomizationSection from '@/app/create/components/canvas-maker-side-bar/CustomizationSection';
import OtherSection from '@/app/create/components/canvas-maker-side-bar/OtherSection';
import OptionsSection from '@/app/create/components/text-maker-side-bar/OptionsSection';
import QuestionSection from '@/app/create/components/text-maker-side-bar/QuestionSection';
import PunctuationSection from '@/app/create/components/text-maker-side-bar/PunctuationSection';
import CanvasMakerTextBox from '@/app/create/components/canvas-maker-text-box/CanvasMakerTextBox';
import TextMakerTextBox from '@/app/create/components/text-maker-text-box/TextMakerTextBox';
import { useSearchParams } from 'next/navigation';

const CreateLayout = () => {
	const { mode, generalRef, setSavedInfo } = useContext(CreateContext)!;
	const router = useSearchParams();

	useEffect(() => {
		if (router.get('id')) {
			fetch(`/api/lesson/${router.get('id')}/`).then((res) => {
				res.json().then((data) => {
					generalRef.current.import(data.content.data);
					setSavedInfo({
						name: data.name,
						label: data.label,
						id: data.id
					});
				});
			});
		}
	}, []);

	return useMemo(() => {
		return (
			<div className='w-screen h-screen flex box-border gap-2.5 overflow-hidden p-2.5 bg-[#97c8ff]'>
				<div className='board'>
					<Canvas />
					{mode === 'canvas' ? <CanvasMakerTextBox /> : <TextMakerTextBox />}
				</div>
				<div className='side-bar'>
					{mode === 'canvas' ? (
						<>
							<ColorSection />
							<CustomizationSection />
							<OtherSection />
						</>
					) : (
						<>
							<PunctuationSection />
							<QuestionSection />
							<OptionsSection />
						</>
					)}
				</div>
			</div>
		);
	}, [mode]);
};

export default CreateLayout;

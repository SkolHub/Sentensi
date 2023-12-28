'use client';

import { useContext } from 'react';
import Canvas from './Canvas';
import { CreateContext } from './CreateContext';
import styles from '../page.module.scss';
import ColorSection from '@/app/create/components/canvas-maker-side-bar/ColorSection';
import CustomizationSection from '@/app/create/components/canvas-maker-side-bar/CustomizationSection';
import OtherSection from '@/app/create/components/canvas-maker-side-bar/OtherSection';
import OptionsSection from '@/app/create/components/text-maker-side-bar/OptionsSection';
import QuestionSection from '@/app/create/components/text-maker-side-bar/QuestionSection';
import PunctuationSection from '@/app/create/components/text-maker-side-bar/PunctuationSection';
import CanvasMakerTextBox from '@/app/create/components/canvas-maker-text-box/CanvasMakerTextBox';
import TextMakerTextBox from '@/app/create/components/text-maker-text-box/TextMakerTextBox';

const CreateLayout = () => {
	const { mode } = useContext(CreateContext)!;

	return (
		<div className={styles.create}>
			<div className="board">
				<Canvas />
				{mode === 'canvas' ? <CanvasMakerTextBox /> : <TextMakerTextBox />}
			</div>
			<div className="side-bar">
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
};

export default CreateLayout;

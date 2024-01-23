import Button from '@/components/Button';
import {
	Checkmark,
	Continue,
	Retry,
	Solve
} from '../../../../../public/icons/icons-module';
import { useContext } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';
import SidebarSection from '@/components/SidebarSection';
import { Slider } from '@mui/joy';

export default () => {
	const {
		status,
		generalRef,
		beginRememberAndWrite,
		nextQuestion,
		repeatQuestion,
		answerQuestion,
		fontSize,
		setFontSize
	} = useContext(PlayContext)!;

	const handleFontSize = (
		_event: Event,
		value: number | number[],
		_activeThumb: number
	) => {
		setFontSize(value as number);
	};

	return (
		<SidebarSection className='!grow-0'>
			<p>Font size</p>
			<Slider
				className='grow'
				onChange={handleFontSize}
				value={fontSize}
				min={1}
				max={4}
				step={1}
				valueLabelDisplay='auto'
				marks
			/>
			<p className='font-semibold text-center select-none'>
				Question {generalRef.current.currentPage + 1}/
				{generalRef.current.pages.length}
			</p>
			{status === 'idle' ? (
				<>
					<Button
						onClick={beginRememberAndWrite}
						title={'Solve'}
						Logo={Solve}
						active
					/>
				</>
			) : status === 'revise' ? (
				<>
					<Button
						onClick={repeatQuestion}
						title={'Try again'}
						Logo={Retry}
						fill={'none'}
						active
					/>
					<Button
						onClick={nextQuestion}
						fill={'none'}
						title={'Continue'}
						Logo={Continue}
						className={'opacity-60'}
						active
					/>
				</>
			) : (
				<>
					<Button
						onClick={answerQuestion}
						title={'Submit'}
						Logo={Checkmark}
						fill='white'
						active
					/>
				</>
			)}
		</SidebarSection>
	);
};

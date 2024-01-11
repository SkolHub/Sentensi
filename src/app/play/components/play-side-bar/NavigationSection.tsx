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

export default () => {
	const {
		status,
		generalRef,
		beginRememberAndWrite,
		nextQuestion,
		repeatQuestion,
		answerQuestion
	} = useContext(PlayContext)!;

	return (
		<SidebarSection className='!grow-0'>
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

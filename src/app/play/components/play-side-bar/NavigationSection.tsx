import Button from '@/components/Button';
import {
	Checkmark,
	Continue,
	Retry,
	Solve
} from '../../../../../public/icons/icons-module';
import { useContext } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';

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
		<div className='section grow'>
			<p>
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
						active
					/>
					<Button
						onClick={nextQuestion}
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
						active
					/>
				</>
			)}
		</div>
	);
};

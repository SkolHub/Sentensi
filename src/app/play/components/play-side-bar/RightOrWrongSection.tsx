import { Checkmark, X } from '../../../../../public/icons/icons-module';
import Button from '@/components/Button';
import { useContext } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';

export default () => {
	const { updater, setUpdater, boolAnswer, setBoolAnswer } =
		useContext(PlayContext)!;

	return (
		<>
			<Button
				onClick={() => {
					setBoolAnswer(!boolAnswer);
					setUpdater(!updater);
				}}
				title={boolAnswer ? 'Right' : 'Wrong'}
				active={false}
				Logo={boolAnswer ? Checkmark : X}
			/>
		</>
	);
};

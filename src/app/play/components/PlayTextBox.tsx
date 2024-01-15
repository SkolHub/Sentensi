import { useContext } from 'react';
import { TextMakerTextBoxModel } from '@/components/TextMakerTextBoxModel';
import { PlayContext } from '@/app/play/components/PlayContext';

const TextMakerTextBox = () => {
	const { selected, setSelected, updater, setUpdater, status, generalRef } =
		useContext(PlayContext)!;

	const general = generalRef.current;

	return (
		<TextMakerTextBoxModel
			setSelected={setSelected}
			selected={selected}
			fontSize={2}
			updater={updater}
			setUpdater={setUpdater}
			canEdit={status === 'solve' && general.type !== 'r|w'}
			wordList={
				status === 'idle' || (status === 'solve' && general.type === 'r|w')
					? general.answer
					: general.playerAnswer
			}
		/>
	);
};

export default TextMakerTextBox;

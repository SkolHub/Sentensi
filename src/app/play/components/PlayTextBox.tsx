import { useContext } from 'react';
import { TextMakerTextBoxModel } from '@/components/TextMakerTextBoxModel';
import { PlayContext } from '@/app/play/components/PlayContext';

const TextMakerTextBox = () => {
	const {
		selected,
		setSelected,
		updater,
		setUpdater,
		status,
		generalRef
	} = useContext(PlayContext)!;

	return (
		<TextMakerTextBoxModel
			setSelected={setSelected}
			selected={selected}
			fontSize={2}
			updater={updater}
			setUpdater={setUpdater}
			canEdit={status === 'solve'}
			wordList={
				status === 'idle' || (status === 'solve' && generalRef.current.type === 'r|w')
					? generalRef.current.answer
					: generalRef.current.playerAnswer
			}
		/>
	);
};

export default TextMakerTextBox;

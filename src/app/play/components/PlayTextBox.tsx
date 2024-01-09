import { useContext } from 'react';
import { TextMakerTextBoxModel } from '@/components/TextMakerTextBoxModel';
import { PlayContext } from '@/app/play/components/PlayContext';

const TextMakerTextBox = () => {
	const { generalRef, selected, setSelected, updater, setUpdater } =
		useContext(PlayContext)!;

	return (
		<TextMakerTextBoxModel
			setSelected={setSelected}
			selected={selected}
			generalRef={generalRef}
			fontSize={2}
			updater={updater}
			setUpdater={setUpdater}
			canEdit={false}
		/>
	);
};

export default TextMakerTextBox;

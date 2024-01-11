import { useContext } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import { TextMakerTextBoxModel } from '@/components/TextMakerTextBoxModel';

const TextMakerTextBox = () => {
	const {
		fontSize,
		generalRef,
		selected,
		setSelected,
		updater,
		setUpdater,
		isSaveOpen
	} = useContext(CreateContext)!;

	return (
		<TextMakerTextBoxModel
			setSelected={setSelected}
			selected={selected}
			fontSize={fontSize}
			updater={updater}
			setUpdater={setUpdater}
			canEdit={!isSaveOpen}
			wordList={generalRef.current.answer}
		/>
	);
};

export default TextMakerTextBox;

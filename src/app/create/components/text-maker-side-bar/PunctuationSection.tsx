import { useContext } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import { PunctuationSectionModel } from '@/components/PunctuationSectionModel';

const PunctuationSection = () => {
	const { generalRef, updater, setUpdater, selected, setSelected } =
		useContext(CreateContext)!;

	return (
		<PunctuationSectionModel
			wordList={generalRef.current.answer}
			updater={updater}
			setUpdater={setUpdater}
			selected={selected}
			setSelected={setSelected}
		/>
	);
};
export default PunctuationSection;

import { useContext } from 'react';
import { PunctuationSectionModel } from '@/components/PunctuationSectionModel';
import { PlayContext } from '@/app/play/components/PlayContext';

const PunctuationSection = () => {
	const { generalRef, updater, setUpdater, selected, setSelected } =
		useContext(PlayContext)!;

	return (
		<PunctuationSectionModel
			generalRef={generalRef}
			updater={updater}
			setUpdater={setUpdater}
			selected={selected}
			setSelected={setSelected}
		/>
	);
};
export default PunctuationSection;

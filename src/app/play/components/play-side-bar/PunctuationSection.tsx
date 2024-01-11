import { useContext } from 'react';
import { PunctuationSectionModel } from '@/components/PunctuationSectionModel';
import { PlayContext } from '@/app/play/components/PlayContext';

const PunctuationSection = () => {
	const { generalRef, updater, setUpdater, selected, setSelected, status } =
		useContext(PlayContext)!;

	return (
		<PunctuationSectionModel
			wordList={
				status === 'idle' ||
				(status === 'solve' && generalRef.current.type === 'r|w')
					? generalRef.current.answer
					: generalRef.current.playerAnswer
			}
			updater={updater}
			setUpdater={setUpdater}
			selected={selected}
			setSelected={setSelected}
		/>
	);
};
export default PunctuationSection;

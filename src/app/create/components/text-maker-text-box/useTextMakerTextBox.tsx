import { useContext, useEffect } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';

const punctuation = ['.', '?', ';', ',', '!', ':', '"', "'", '-'];

const useTextMakerTextBox = () => {
	const { generalRef, updater, setUpdater, selected, setSelected } = useContext(CreateContext)!;

	useEffect(() => {

		const general = generalRef.current;

		const handleKeyDown = (e: KeyboardEvent) => {
			const sel = selected === -1 ? general.answer.length - 1 : selected;

			if (e.key === 'Backspace' && general.answer.length) {
				if (punctuation.includes(general.answer[sel].at(-1)!)) {
					general.answer[sel] = general.answer[sel].slice(0, -1);
				} else {
					general.answer.splice(sel, 1);

					setSelected(-1);
				}

				setUpdater(!updater);
			}
		}

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		}
	}, [updater, setUpdater, selected, setSelected]);
}

export default useTextMakerTextBox;
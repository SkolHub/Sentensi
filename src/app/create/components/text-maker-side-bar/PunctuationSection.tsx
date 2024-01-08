import { Glue, Text } from '../../../../../public/icons/icons-module';
import { useCallback, useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import SimpleButton from '@/components/SimpleButton';
import Button from '@/components/Button';

const symbols = ['.', '?', ';', ',', '!', ':', '"', "'", '-'];

const PunctuationSection = () => {
	const { generalRef, updater, setUpdater, selected, setSelected } =
		useContext(CreateContext)!;

	const general = generalRef.current;

	const handleGlueClick = useCallback(() => {
		const sel = selected != -1 ? selected : general.answer.length - 1;

		if (general.answer.length && sel != 0) {
			const word = general.answer[sel];

			if (word[0] === '\x80') {
				general.answer[sel] = word.substring(1);
			} else {
				general.answer[sel] = '\x80' + word;
			}

			setUpdater(!updater);
			setSelected(-1);
		}
	}, [selected, updater]);

	const handleCapitaliseClick = useCallback(() => {
		const sel = selected != -1 ? selected : general.answer.length - 1;

		if (general.answer.length) {
			const word = general.answer[sel];
			const glued = +(word[0] === '\x80');

			const char = general.answer[sel][glued];

			if (char.toUpperCase() === char) {
				general.answer[sel] =
					(glued ? '\x80' : '') +
					char.toLowerCase() +
					word.substring(1 + glued);
			} else {
				general.answer[sel] =
					(glued ? '\x80' : '') +
					char.toUpperCase() +
					word.substring(1 + glued);
			}

			setUpdater(!updater);
			setSelected(-1);
		}
	}, [selected, updater]);

	const handlePunctuationClick = useCallback(
		(symbol: string) => {
			if (general.answer.length) {
				const sel = selected === -1 ? general.answer.length - 1 : selected;
				general.answer[sel] += symbol;

				setSelected(-1);

				setUpdater(!updater);
			}
		},
		[selected, updater]
	);

	return useMemo(
		() => (
			<div className='section grow'>
				<div className='grid grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr] gap-4'>
					{symbols.map((symbol: string, index: number) => (
						<SimpleButton
							onClick={() => {
								handlePunctuationClick(symbol);
							}}
							symbol={symbol}
							key={index}
						/>
					))}
				</div>
				<Button
					onClick={handleGlueClick}
					title={'Glue'}
					Logo={Glue}
					active={true}
				/>
				<Button
					onClick={handleCapitaliseClick}
					title={'Capitalize'}
					Logo={Text}
					active={true}
				/>
			</div>
		),
		[updater, selected]
	);
};
export default PunctuationSection;

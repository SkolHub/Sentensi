import { symbols, usePunctuation } from '@/lib/hooks/usePunctuation';
import { Dispatch, SetStateAction, useMemo } from 'react';
import SimpleButton from '@/components/SimpleButton';
import Button from '@/components/Button';
import { Glue, Text } from '../../public/icons/icons-module';

interface Props {
	wordList: string[];
	updater: boolean;
	setUpdater: Dispatch<SetStateAction<boolean>>;
	selected: number;
	setSelected: Dispatch<SetStateAction<number>>;
}

export const PunctuationSectionModel = ({
	wordList,
	updater,
	setUpdater,
	selected,
	setSelected
}: Props) => {
	const { handlePunctuationClick, handleGlueClick, handleCapitaliseClick } =
		usePunctuation(wordList, updater, setUpdater, selected, setSelected);

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

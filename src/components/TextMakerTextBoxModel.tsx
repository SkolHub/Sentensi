import { useTextMakerTextBox } from '@/lib/hooks/useTextMakerTextBox';
import { Dispatch, SetStateAction, useMemo } from 'react';

interface Props {
	updater: boolean;
	setUpdater: Dispatch<SetStateAction<boolean>>;
	selected: number;
	setSelected: Dispatch<SetStateAction<number>>;
	fontSize: number;
	canEdit: boolean;
	wordList: string[];
}

export const TextMakerTextBoxModel = ({
	updater,
	setUpdater,
	selected,
	setSelected,
	fontSize,
	canEdit,
	wordList
}: Props) => {
	const { wordClick, calcStyle, zoom } = useTextMakerTextBox(
		updater,
		setUpdater,
		selected,
		setSelected,
		fontSize,
		canEdit,
		wordList
	);

	return useMemo(
		() => (
			<div className='section text-box !pl-0'>
				{wordList.map((word: string, index: number) => {
					return (
						<span
							onMouseDown={() => {
								if (canEdit) {
									wordClick(index);
								}
							}}
							style={calcStyle(index, word)}
							key={index}
						>
							{word.replace('\x80', '')}
						</span>
					);
				})}
			</div>
		),
		[updater, zoom, selected, canEdit]
	);
};

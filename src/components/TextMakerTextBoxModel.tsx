import { useTextMakerTextBox } from '@/lib/hooks/useTextMakerTextBox';
import { Dispatch, MutableRefObject, SetStateAction, useMemo } from 'react';
import { MainGeneral } from '@/lib/logic/packages/generals/main.general';

interface Props {
	generalRef: MutableRefObject<MainGeneral>;
	updater: boolean;
	setUpdater: Dispatch<SetStateAction<boolean>>;
	selected: number;
	setSelected: Dispatch<SetStateAction<number>>;
	fontSize: number;
	canEdit: boolean;
}

export const TextMakerTextBoxModel = ({
	generalRef,
	updater,
	setUpdater,
	selected,
	setSelected,
	fontSize,
	canEdit
}: Props) => {
	const { wordClick, calcStyle, zoom } = useTextMakerTextBox(
		generalRef,
		updater,
		setUpdater,
		selected,
		setSelected,
		fontSize,
		canEdit
	);

	return useMemo(
		() => (
			<div className='section text-box'>
				{generalRef.current.answer.map((word: string, index: number) => {
					return <span
						onMouseDown={() => {
							wordClick(index);
						}}
						style={calcStyle(index, word)}
						key={index}
					>
						{word.replace('\x80', '')}
					</span>;
				})}
			</div>
		),
		[updater, zoom, selected]
	);
};

import { useTextMakerTextBox } from '@/lib/hooks/useTextMakerTextBox';
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react';

interface Props {
	updater: boolean;
	setUpdater: Dispatch<SetStateAction<boolean>>;
	selected: number;
	setSelected: Dispatch<SetStateAction<number>>;
	fontSize: number;
	canEdit: boolean;
	wordList: string[];
	expanded: boolean;
	setExpanded: Dispatch<SetStateAction<boolean>>;
}

export const TextMakerTextBoxModel = ({
	updater,
	setUpdater,
	selected,
	setSelected,
	fontSize,
	canEdit,
	wordList,
	expanded,
	setExpanded
}: Props) => {
	const { wordClick, calcStyle, zoom } = useTextMakerTextBox(
		updater,
		setUpdater,
		selected,
		setSelected,
		fontSize,
		canEdit,
		wordList,
		setExpanded
	);

	const textBoxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (expanded) {
			setExpanded(false);

			textBoxRef.current!.scrollTo(0, 10000);
		}
	}, [expanded]);

	return useMemo(
		() => (
			<div ref={textBoxRef} className='section text-box !pl-0'>
				{wordList.map((word: string, index: number) => (
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
				))}
			</div>
		),
		[updater, zoom, selected, canEdit, fontSize]
	);
};

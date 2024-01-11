import { Checkmark, X } from '../../../../../public/icons/icons-module';
import Button from '@/components/Button';
import { useContext } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';
import SidebarSection from '@/components/SidebarSection';

export default () => {
	const { updater, setUpdater, boolAnswer, setBoolAnswer } =
		useContext(PlayContext)!;

	return (
		<SidebarSection
			className={`grow-0 ${boolAnswer ? 'questionRight' : 'questionWrong'}`}
		>
			<Button
				onClick={() => {
					setBoolAnswer(!boolAnswer);
					setUpdater(!updater);
				}}
				title={boolAnswer ? 'Right' : 'Wrong'}
				active={false}
				fill='black'
				stroke='none'
				Logo={boolAnswer ? Checkmark : X}
			/>
		</SidebarSection>
	);
};

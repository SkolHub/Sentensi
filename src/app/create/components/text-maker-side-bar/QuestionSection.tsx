import { Input, Option, Select } from '@mui/joy';
import { SyntheticEvent, useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import { Checkmark, X } from '../../../../../public/icons/icons-module';
import Button from '@/components/Button';
import SidebarSection from '@/components/SidebarSection';

const QuestionSection = () => {
	const { generalRef, updater, setUpdater } = useContext(CreateContext)!;

	const handleSelectChange = (
		event: SyntheticEvent | null,
		newValue: 'r&w' | 'l&w' | 'r|w' | null
	) => {
		generalRef.current.pages[generalRef.current.currentPage].type = newValue!;

		switch (newValue) {
			case 'l&w':
				generalRef.current.pages[generalRef.current.currentPage].data = '';
				break;

			case 'r&w':
				generalRef.current.pages[generalRef.current.currentPage].data = null;
				break;

			case 'r|w':
				generalRef.current.pages[generalRef.current.currentPage].data = true;
		}

		setUpdater(!updater);
	};

	return useMemo(
		() => (
			<SidebarSection
				className={`!grow-0 ${
					generalRef.current.activityType === 'r|w'
						? generalRef.current.activityData
							? 'questionRight'
							: 'questionWrong'
						: ''
				}`}
			>
				<Select
					onChange={handleSelectChange}
					value={generalRef.current.activityType}
				>
					<Option value='r&w'>Remember & Write</Option>
					<Option value='l&w'>Listen & Write</Option>
					<Option value='r|w'>Right or Wrong</Option>
				</Select>
				{
					{
						'r&w': <></>,
						'l&w': (
							<Input
								value={generalRef.current.activityData as string}
								onChange={(e) => {
									generalRef.current.pages[
										generalRef.current.currentPage
									].data = e.target.value;

									setUpdater(!updater);
								}}
								placeholder='Sound url…'
							/>
						),
						'r|w': (
							<Button
								onClick={() => {
									generalRef.current.pages[
										generalRef.current.currentPage
									].data = !generalRef.current.activityData;
									setUpdater(!updater);
								}}
								title={generalRef.current.activityData ? 'Right' : 'Wrong'}
								fill='black'
								stroke='none'
								active={false}
								Logo={generalRef.current.activityData ? Checkmark : X}
							/>
						)
					}[generalRef.current.pages[generalRef.current.currentPage].type]
				}
			</SidebarSection>
		),
		[updater]
	);
};

export default QuestionSection;

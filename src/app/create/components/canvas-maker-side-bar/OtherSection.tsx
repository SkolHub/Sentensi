import { useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import { Save, Text, Trash } from '../../../../../public/icons/icons-module';
import Button from '@/components/Button';
import SidebarSection from '@/components/SidebarSection';

const OtherSection = () => {
	const { setMode, generalRef, setIsSaveOpen } = useContext(CreateContext)!;

	const handleTextMakerClick = () => {
		setMode('text');
	};

	const handleSaveClick = () => {
		setIsSaveOpen(true);
	};

	const handleClearClick = () => {
		generalRef.current.clearPage();
	};

	return useMemo(
		() => (
			<SidebarSection className='height-1:!flex-row'>
				<Button
					onClick={handleTextMakerClick}
					title={'Text maker'}
					Logo={Text}
					active
				/>
				<div className='flex flex-col gap-4 grow'>
					<Button
						onClick={handleSaveClick}
						title={'Save'}
						Logo={Save}
						active
					/>
					<Button
						onClick={handleClearClick}
						title={'Clear page'}
						Logo={Trash}
						active={true}
						color={'#EB445A'}
					/>
				</div>
			</SidebarSection>
		),
		[]
	);
};

export default OtherSection;

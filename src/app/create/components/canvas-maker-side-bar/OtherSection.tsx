import { useContext } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import Button from '@/components/Button/Button';
import { Save, Text, Trash } from '../../../../../public/icons/icons-module';

const OtherSection = () => {
	const { setMode, generalRef } = useContext(CreateContext)!;

	const handleTextMakerClick = () => {
		setMode('text');
	};

	const handleSaveClick = () => {};

	const handleClearClick = () => {
		generalRef.current.clearPage();
	};

	return (
		<div className="section">
			<Button onClick={handleSaveClick} title={'Save'} Logo={Save} active />
			<Button
				onClick={handleTextMakerClick}
				title={'Text maker'}
				Logo={Text}
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
	);
};

export default OtherSection;
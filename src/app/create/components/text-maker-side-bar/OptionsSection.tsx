import { useContext } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import Button from '@/components/Button/Button';
import { Canvas, New, Save, Trash } from '../../../../../public/icons/icons-module';

const OptionsSection = () => {
	const { setMode } = useContext(CreateContext)!;

	const handleCanvasMakerClick = () => {
		setMode('canvas');
	};

	return (
		<div className="section">
			<Button title={'New page'} Logo={New} active={true} />
			<Button title={'Delete page'} Logo={Trash} active={true} color={'#EB445A'} />
			<Button
				onClick={handleCanvasMakerClick}
				title={'Canvas maker'}
				Logo={Canvas}
				active={true}
			/>
			<Button title={'Save'} Logo={Save} active={true} />
		</div>
	);
};

export default OptionsSection;
import Button from '@/components/Button';
import { Continue, Retry } from '../../../../../public/icons/icons-module';

export default () => {
	return (
		<div className='section grow'>
			<Button title={'Try again'} Logo={Retry} active />
			<Button title={'Continue'} Logo={Continue} active />
		</div>
	);
};

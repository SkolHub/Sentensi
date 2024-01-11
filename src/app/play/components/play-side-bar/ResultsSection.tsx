import { useContext } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';

export default () => {
	const { right, wrong, retries } = useContext(PlayContext)!;

	return (
		<div className='section grow'>
			<p>{right === 0 ? 'no' : right} right answer{right !== 1 ? 's' : ''}</p>
			<p>{wrong === 0 ? 'no' : wrong} wrong answer{wrong !== 1 ? 's' : ''}</p>
			<p>{retries === 0 ? 'no' : retries} retr{retries !== 1 ? 'ies' : 'y'}</p>
		</div>
	);
};

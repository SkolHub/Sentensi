import { useContext } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';
import SidebarSection from '@/components/SidebarSection';
import { GreenCheck, RedX } from '../../../../../public/icons/icons-module';

export default () => {
	const { right, wrong, retries, status } = useContext(PlayContext)!;

	return (
		<SidebarSection>
			<p className='font-semibold select-none'>
				<span className='text-[#2DD36F]'>{right === 0 ? 'no' : right}</span>{' '}
				right answer{right !== 1 ? 's' : ''}
			</p>
			<p className='font-semibold select-none'>
				<span className='text-[#EB445A]'>{wrong === 0 ? 'no' : wrong}</span>{' '}
				wrong answer{wrong !== 1 ? 's' : ''}
			</p>
			<p className='font-semibold select-none'>
				<span className='text-[#FFC409]'>{retries === 0 ? 'no' : retries}</span>{' '}
				retr{retries !== 1 ? 'ies' : 'y'}
			</p>
			{status === 'revise' ? <RedX className='self-center' /> : ''}
			{status === 'correct' ? <GreenCheck className='self-center' /> : ''}
		</SidebarSection>
	);
};

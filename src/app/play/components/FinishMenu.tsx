'use client';

import {
	DialogContent,
	DialogTitle,
	Divider,
	Modal,
	ModalDialog
} from '@mui/joy';
import { useContext } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';

export default () => {
	const { status, right, wrong, retries } = useContext(PlayContext)!;

	return (
		<Modal open={status === 'finish'}>
			<ModalDialog variant='outlined' role='alertdialog'>
				<DialogTitle>Congrats!</DialogTitle>
				<Divider />
				<DialogContent>
					You finished the assignment with:
					<p className='font-semibold'>
						<span className='text-[#2DD36F]'>{right === 0 ? 'no' : right}</span>{' '}
						right answer{right !== 1 ? 's' : ''}
					</p>
					<p className='font-semibold'>
						<span className='text-[#EB445A]'>{wrong === 0 ? 'no' : wrong}</span>{' '}
						wrong answer{wrong !== 1 ? 's' : ''}
					</p>
					<p className='font-semibold'>
						<span className='text-[#FFC409]'>
							{retries === 0 ? 'no' : retries}
						</span>{' '}
						retr{retries !== 1 ? 'ies' : 'y'}
					</p>
					<br />
					You may close this window.
				</DialogContent>
			</ModalDialog>
		</Modal>
	);
};

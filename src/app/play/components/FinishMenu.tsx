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
					<p>
						{right === 0 ? 'no' : right} right answer{right !== 1 ? 's' : ''}
					</p>
					<p>
						{wrong === 0 ? 'no' : wrong} wrong answer{wrong !== 1 ? 's' : ''}
					</p>
					<p>
						{retries === 0 ? 'no' : retries} retr{retries !== 1 ? 'ies' : 'y'}
					</p>
					<br />
					You may close this window.
				</DialogContent>
			</ModalDialog>
		</Modal>
	);
};

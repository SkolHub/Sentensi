'use client';

import {
	Button as MUIButton,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Input,
	Modal,
	ModalDialog
} from '@mui/joy';
import { useContext, useMemo, useState } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';
import { useSearchParams } from 'next/navigation';

export default () => {
	const { setPlayerName, generalRef, updater, setUpdater, setStatus } =
		useContext(PlayContext)!;

	const [open, setOpen] = useState<boolean>(true);
	const [name, setName] = useState<string>('');

	const router = useSearchParams();

	const general = generalRef.current;

	return useMemo(
		() => (
			<Modal open={open}>
				<ModalDialog variant='outlined' role='alertdialog'>
					<DialogTitle>Save</DialogTitle>
					<Divider />
					<DialogContent>
						Write your name
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder='Your name'
						/>
					</DialogContent>
					<DialogActions>
						<MUIButton
							variant='solid'
							color='primary'
							onClick={() => {
								if (open) {
									setPlayerName(name);
									setOpen(false);
									fetch(`/api/lesson/${router.get('id')}/`).then((res) => {
										console.log(res)
										res.json().then((data) => {
											console.log(data)

											generalRef.current.import(data.content.data);

											switch (general.type) {
												case 'l&w':
												case 'r|w':
													setStatus('solve');
													break;

												case 'r&w':
													setStatus('idle');
													break;
											}

											generalRef.current.render();
											setUpdater(!updater);
										});
									});
								}
							}}
							disabled={name.length === 0}
						>
							Continue
						</MUIButton>
					</DialogActions>
				</ModalDialog>
			</Modal>
		),
		[open, name, updater]
	);
};

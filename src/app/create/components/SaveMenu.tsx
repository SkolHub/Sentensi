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
import { CreateContext } from '@/app/create/components/CreateContext';
import { useRouter } from 'next/navigation';

const SaveMenu = () => {
	const { isSaveOpen, setIsSaveOpen, savedName, setSavedName, generalRef } =
		useContext(CreateContext)!;

	const [label, setLabel] = useState<string>('');

	const router = useRouter();

	return useMemo(
		() => (
			<Modal open={isSaveOpen} onClose={() => setIsSaveOpen(false)}>
				<ModalDialog variant='outlined' role='alertdialog'>
					<DialogTitle>Save</DialogTitle>
					<Divider />
					<DialogContent>
						Provide a name for the lesson
						<Input
							value={savedName}
							onChange={(e) => setSavedName(e.target.value)}
							placeholder='Lesson name'
						/>
						<Input
							value={label}
							onChange={(e) => setLabel(e.target.value)}
							placeholder='Lesson label (optional)'
						/>
					</DialogContent>
					<DialogActions>
						<MUIButton
							variant='solid'
							color='primary'
							onClick={() => {
								setIsSaveOpen(false);
								fetch(`/api/lesson`, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										data: generalRef.current.export(),
										name: savedName,
										label
									})
								}).then(() => {
									router.push('/');
								});
							}}
							disabled={savedName.length === 0}
						>
							Save
						</MUIButton>
						<MUIButton
							variant='plain'
							color='neutral'
							onClick={() => setIsSaveOpen(false)}
						>
							Cancel
						</MUIButton>
					</DialogActions>
				</ModalDialog>
			</Modal>
		),
		[isSaveOpen, savedName, label]
	);
};

export default SaveMenu;

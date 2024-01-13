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
import { useContext, useMemo } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import { useRouter } from 'next/navigation';
import { POST } from '@/app/api/lesson/[id]/route';

const SaveMenu = () => {
	const { isSaveOpen, setIsSaveOpen, savedInfo, setSavedInfo, generalRef } =
		useContext(CreateContext)!;

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
							value={savedInfo.name}
							onChange={(e) =>
								setSavedInfo({ ...savedInfo, name: e.target.value })
							}
							placeholder='Lesson name'
						/>
						<Input
							value={savedInfo.label}
							onChange={(e) =>
								setSavedInfo({ ...savedInfo, label: e.target.value })
							}
							placeholder='Lesson label (optional)'
						/>
					</DialogContent>
					<DialogActions>
						<MUIButton
							variant='solid'
							color='primary'
							onClick={() => {
								setIsSaveOpen(false);
								if (savedInfo.id) {
									fetch(`/api/lesson/${savedInfo.id}`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											data: generalRef.current.export(),
											name: savedInfo.name,
											label: savedInfo.label
										})
									}).then(() => {
										router.push('/');
									});
								} else {
									fetch(`/api/lesson`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											data: generalRef.current.export(),
											name: savedInfo.name,
											label: savedInfo.label
										})
									}).then(() => {
										router.push('/');
									});
								}
							}}
							disabled={savedInfo.name.length === 0}
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
		[isSaveOpen, savedInfo]
	);
};

export default SaveMenu;

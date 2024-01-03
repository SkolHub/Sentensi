'use client';

import { useContext, useMemo, useState } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import Button from '@/components/Button/Button';
import {
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Input,
	Button as MUIButton,
	ModalDialog
} from '@mui/joy';
import {
	Canvas,
	New,
	Save,
	Trash
} from '../../../../../public/icons/icons-module';
import Counter from '@/app/create/components/text-maker-side-bar/Counter';
import { Modal } from '@mui/joy';
import { useRouter } from 'next/navigation';

const OptionsSection = () => {
	const { setMode, generalRef, updater, setUpdater, savedName: name, setSavedName: setName } =
		useContext(CreateContext)!;
	const [value, setValue] = useState<number>(
		generalRef.current.currentPage + 1
	);

	const [open, setOpen] = useState<boolean>(false);

	const router = useRouter();

	const handleCanvasMakerClick = () => {
		setMode('canvas');
	};

	const setVal = (val: number) => {
		if (val > generalRef.current.pages.length) {
			setValue(generalRef.current.pages.length);
			generalRef.current.currentPage = generalRef.current.pages.length - 1;
		} else if (val < 1) {
			setValue('' as any as number);
		} else {
			setValue(+val);
			generalRef.current.currentPage = +val - 1;
		}

		generalRef.current.render!();
		setUpdater(!updater);
	};

	const handlePlus = () => {
		setVal(value + 1);
	};

	const handleMinus = () => {
		setVal(value > 1 ? value - 1 : value);
	};

	const handleChange = (e: any) => {
		setVal(+e.target.value);
	};

	const handleBlur = (e: any) => {
		if (e.target.value === '') {
			setVal(1);
		}
	};

	const handleNewPage = () => {
		generalRef.current.createPage();
		setVal(generalRef.current.currentPage + 1);
	};

	const handleDeletePage = () => {
		generalRef.current.deletePage();
		setVal(generalRef.current.currentPage + 1);
	};

	const handleSave = () => {
		setOpen(true);
	};

	return useMemo(
		() => (
			<div className="section">
				<Counter
					onChange={handleChange}
					onBlur={handleBlur}
					onPlus={handlePlus}
					onMinus={handleMinus}
					value={value}
				/>
				<Button onClick={handleNewPage} title={'New page'} Logo={New} active />
				<Button
					onClick={handleDeletePage}
					title={'Delete page'}
					Logo={Trash}
					color={'#EB445A'}
					active
				/>
				<Button
					onClick={handleCanvasMakerClick}
					title={'Canvas maker'}
					Logo={Canvas}
					active
				/>
				<Button onClick={handleSave} title={'Save'} Logo={Save} active />
				<Modal open={open} onClose={() => setOpen(false)}>
					<ModalDialog variant="outlined" role="alertdialog">
						<DialogTitle>Save</DialogTitle>
						<Divider />
						<DialogContent>
							Provide a name for the lesson
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Lesson name"
							/>
						</DialogContent>
						<DialogActions>
							<MUIButton
								variant="solid"
								color="primary"
								onClick={() => {
									setOpen(false);
									fetch(`/api/lesson`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											data: generalRef.current.pages,
											name: name
										})
									}).then(() => {
										router.push('/');
									});
								}}
								disabled={name.length === 0}
							>
								Save
							</MUIButton>
							<MUIButton
								variant="plain"
								color="neutral"
								onClick={() => setOpen(false)}
							>
								Cancel
							</MUIButton>
						</DialogActions>
					</ModalDialog>
				</Modal>
			</div>
		),
		[updater, open, name]
	);
};

export default OptionsSection;

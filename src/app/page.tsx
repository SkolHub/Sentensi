'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
	Button as MUIButton,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Modal,
	ModalDialog
} from '@mui/joy';

export default function Home() {
	const [data, setData] = useState<any[]>([]);
	const [data2, setData2] = useState<any[]>([]);
	const [openId, setOpenId] = useState<number>(-1);

	const [label, setLabel] = useState<string>('');

	useEffect(() => {
		fetch(`/api/lesson/`).then((res) => {
			res.json().then((data) => {
				setData(data);
			});
		});

		fetch(`/api/player/`).then((res) => {
			res.json().then((data) => {
				setData2(data);
				console.log(data);
			});
		});
	}, []);

	return (
		<main
			style={{
				background: '#E3F5FF',
				width: '100vw',
				height: '100vh',
				overflow: 'auto'
			}}
		>
			<header>
				<Link href={'/create'}>
					<button>Create</button>
				</Link>
				<input
					value={label}
					onChange={(e) => {
						setLabel(e.target.value);
					}}
					placeholder='filter (label)'
				/>
				{data
					.filter((el) => el.label.includes(label))
					.map((el, index) => (
						<p key={index}>
							{index + 1}. {el.name}: <a href={`/play/?id=${el.id}`}>Play</a>;{' '}
							<button
								onClick={() => {
									setOpenId(el.id);
								}}
							>
								View Results
							</button>
							; Label: {el.label};{' '}
							<a href={`/create/?id=${el.id}`}>Edit</a>;{' '}
						</p>
					))}
			</header>
			<Modal open={openId !== -1} onClose={() => setOpenId(-1)}>
				<ModalDialog variant='outlined' role='alertdialog'>
					<DialogTitle>Results</DialogTitle>
					<Divider />
					<DialogContent>
						{data2
							.filter((el) => el.lessonID === openId)
							.map((el2, index) => (
								<p key={index}>
									{el2.name}: {el2.result}
								</p>
							))}
					</DialogContent>
					<DialogActions>
						<MUIButton
							variant='plain'
							color='neutral'
							onClick={() => setOpenId(-1)}
						>
							Close
						</MUIButton>
					</DialogActions>
				</ModalDialog>
			</Modal>
		</main>
	);
}

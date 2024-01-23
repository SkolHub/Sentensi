'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Input,
	Modal,
	ModalDialog,
	Table
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
			<header className='flex'>
				<Link href={'/create'}>
					<Button variant='soft' color='primary'>
						Create new lesson
					</Button>
				</Link>
				<Input
					value={label}
					onChange={(e) => setLabel(e.target.value)}
					placeholder='Filter by label'
				/>
			</header>
			<main>
				<Table>
					<thead>
						<tr>
							<th>Row</th>
							<th>ID</th>
							<th>Name</th>
							<th>Label</th>
							<th>Play</th>
							<th>Results</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{data
							.filter((el) => el.label.includes(label))
							.map((el, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{el.id}</td>
									<td>{el.name}</td>
									<td>{el.label}</td>
									<td>
										<Link href={`/play/?id=${el.id}`} target={'_blank'}>
											<Button variant='soft' color='primary'>
												Play
											</Button>
										</Link>
										<label
											className='cursor-pointer'
											onClick={() => {
												navigator.clipboard.writeText(`${window.location.host}/play/?id=${el.id}`);
											}}
										>
											Copy
										</label>
									</td>
									<td>
										<Button
											variant='soft'
											color='success'
											onClick={() => {
												setOpenId(el.id);
											}}
										>
											View results
										</Button>
									</td>
									<td>
										<Button
											onClick={() => {
												fetch(`/api/lesson/${el.id}`, {
													method: 'DELETE'
												}).then(() => {
													window.location.reload();
												});
											}}
											variant='soft'
											color='danger'
										>
											Delete
										</Button>
										<Link href={`/create/?id=${el.id}`}>
											<Button variant='soft' color='primary'>
												Edit
											</Button>
										</Link>
									</td>
								</tr>
							))}
					</tbody>
				</Table>
			</main>
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
						<Button
							variant='plain'
							color='neutral'
							onClick={() => setOpenId(-1)}
						>
							Close
						</Button>
					</DialogActions>
				</ModalDialog>
			</Modal>
		</main>
	);
}

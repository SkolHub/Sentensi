'use client';

import { useEffect, useState } from 'react';
import './page.module.scss';

export default function Home() {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		fetch(`/api/lesson/`).then((res) => {
			res.json().then((data) => {
				setData(data);
			});
		});
	});

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
				<button>Create</button>
				{
					data.map(el => <p>{el.id}. {el.name}: <a href={`/play/?id=${el.id}`}>Play</a>; <a>View Results</a></p>)
				}
			</header>
			<div></div>
		</main>
	);
}

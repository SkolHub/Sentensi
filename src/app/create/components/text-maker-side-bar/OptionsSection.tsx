'use client';

import { useContext, useMemo, useState } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import Button from '@/components/Button/Button';
import {
	Canvas,
	New,
	Save,
	Trash
} from '../../../../../public/icons/icons-module';
import Counter from '@/app/create/components/text-maker-side-bar/Counter';

const OptionsSection = () => {
	const { setMode, generalRef, updater, setUpdater } =
		useContext(CreateContext)!;
	const [value, setValue] = useState<number>(
		generalRef.current.currentPage + 1
	);

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
				<Button title={'Save'} Logo={Save} active />
			</div>
		),
		[]
	);
};

export default OptionsSection;

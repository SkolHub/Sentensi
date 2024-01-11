import { useContext, useMemo, useState } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';
import {
	Canvas,
	New,
	Save,
	Trash
} from '../../../../../public/icons/icons-module';
import Counter from '@/app/create/components/text-maker-side-bar/Counter';
import Button from '@/components/Button';
import SidebarSection from '@/components/SidebarSection';

const OptionsSection = () => {
	const { setMode, generalRef, updater, setUpdater, setIsSaveOpen } =
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

	const handleSave = () => {
		setIsSaveOpen(true);
	};

	return useMemo(
		() => (
			<SidebarSection>
				<Counter
					onChange={handleChange}
					onBlur={handleBlur}
					onPlus={handlePlus}
					onMinus={handleMinus}
					value={value}
				/>
				<div className='flex flex-col gap-4 grow height-2:gap-2 height-1:flex-row'>
					<Button
						onClick={handleNewPage}
						title={'New page'}
						Logo={New}
						active
					/>
					<Button
						onClick={handleDeletePage}
						title={'Delete page'}
						Logo={Trash}
						color={'#EB445A'}
						active
					/>
				</div>
				<div className='flex flex-col gap-4 grow height-2:gap-2 height-1:flex-row'>
					<Button
						onClick={handleCanvasMakerClick}
						title={'Canvas maker'}
						Logo={Canvas}
						active
					/>
					<Button onClick={handleSave} title={'Save'} Logo={Save} active />
				</div>
			</SidebarSection>
		),
		[updater, open]
	);
};

export default OptionsSection;

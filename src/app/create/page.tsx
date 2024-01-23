import { CreateContextProvider } from '@/app/create/components/CreateContext';
import CreateLayout from '@/app/create/components/CreateLayout';
import { TextBoxContextProvider } from '@/lib/contexts/TextBoxContext';
import SaveMenu from '@/app/create/components/SaveMenu';

const Create = () => {
	return (
		<CreateContextProvider>
			<TextBoxContextProvider>
				<CreateLayout />
				<SaveMenu />
				<div
					style={{
						fontFamily: '"Whiteboard"',
						position: 'fixed',
						top: '-100vh',
						right: '-100vw'
					}}
				>
					.
				</div>
			</TextBoxContextProvider>
		</CreateContextProvider>
	);
};

export default Create;

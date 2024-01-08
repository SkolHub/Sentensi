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
			</TextBoxContextProvider>
		</CreateContextProvider>
	);
};

export default Create;

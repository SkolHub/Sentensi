import { CreateContextProvider } from '@/app/create/components/CreateContext';
import CreateLayout from '@/app/create/components/CreateLayout';
import { TextBoxContextProvider } from '@/lib/contexts/TextBoxContext';

const Create = () => {
	return (
		<CreateContextProvider>
			<TextBoxContextProvider>
				<CreateLayout />
			</TextBoxContextProvider>
		</CreateContextProvider>
	);
};

export default Create;

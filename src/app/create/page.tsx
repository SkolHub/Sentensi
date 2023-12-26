import { CreateContextProvider } from '@/app/create/components/CreateContext';
import CreateLayout from '@/app/create/components/CreateLayout';

const Create = () => {
	return <CreateContextProvider>
		<CreateLayout />
	</CreateContextProvider>;
};

export default Create;
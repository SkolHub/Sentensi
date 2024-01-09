import { TextBoxContextProvider } from '@/lib/contexts/TextBoxContext';
import PlayLayout from '@/app/play/components/PlayLayout';
import { PlayContextProvider } from './components/PlayContext';

export default () => {
	return (
		<PlayContextProvider>
			<TextBoxContextProvider>
				<PlayLayout />
			</TextBoxContextProvider>
		</PlayContextProvider>
	);
};
import { TextBoxContextProvider } from '@/lib/contexts/TextBoxContext';
import PlayLayout from '@/app/play/components/PlayLayout';
import { PlayContextProvider } from './components/PlayContext';
import CredentialsMenu from '@/app/play/components/CredentialsMenu';
import FinishMenu from '@/app/play/components/FinishMenu';

export default () => {
	return (
		<PlayContextProvider>
			<TextBoxContextProvider>
				<PlayLayout />
				<CredentialsMenu />
				<FinishMenu />
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
		</PlayContextProvider>
	);
};

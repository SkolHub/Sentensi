import { useContext } from 'react';
import { PlayContext } from '@/app/play/components/PlayContext';
import SidebarSection from '@/components/SidebarSection';

export default () => {
	const { generalRef } = useContext(PlayContext)!;

	return (
		<SidebarSection className='grow-0'>
			<audio controls>
				<source
					src={
						generalRef.current.pages[generalRef.current.currentPage]
							.data as string
					}
					type='audio/ogg'
				/>
				Your browser does not support the audio tag.
			</audio>
		</SidebarSection>
	);
};

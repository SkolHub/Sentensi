import styles from '@/app/create/page.module.scss';
import SimpleButton from '@/components/SimpleButton/SimpleButton';
import Button from '@/components/Button/Button';
import { Glue, Text } from '../../../../../public/icons/icons-module';
import { useContext } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';

const symbols = ['.', '?', ';', ',', '!', ':', '"', "'", '-'];

const PunctuationSection = () => {
	const { generalRef, updater, setUpdater, selected, setSelected } =
		useContext(CreateContext)!;

	const general = generalRef.current;

	const handleGlueClick = () => {
		const sel = selected != -1 ? selected : general.answer.length - 1;

		if (general.answer.length && sel != 0) {
			const word = general.answer[sel];

			if (word[0] === '\x80') {
				general.answer[sel] = word.substring(1);
			} else {
				general.answer[sel] = '\x80' + word;
			}

			setUpdater(!updater);
			setSelected(-1);
		}
	};

	const handleCapitaliseClick = () => {
		const sel = selected != -1 ? selected : general.answer.length - 1;

		if (general.answer.length) {
			const word = general.answer[sel];
			const glued = +(word[0] === '\x80');

			const char = general.answer[sel][glued];

			if (char.toUpperCase() === char) {
				general.answer[sel] =
					(glued ? '\x80' : '') +
					char.toLowerCase() +
					word.substring(1 + glued);
			} else {
				general.answer[sel] =
					(glued ? '\x80' : '') +
					char.toUpperCase() +
					word.substring(1 + glued);
			}

			setUpdater(!updater);
			setSelected(-1);
		}
	};

	return (
		<div className="section">
			<div className={styles.symbols}>
				{symbols.map((symbol: string, index: number) => (
					<SimpleButton
						onClick={() => {
							if (general.answer.length) {
								const sel = selected === -1 ? general.answer.length - 1 : selected;
								general.answer[sel] += symbol;

								setSelected(-1);

								setUpdater(!updater);
							}
						}}
						symbol={symbol}
						key={index}
					/>
				))}
			</div>
			<Button
				onClick={handleGlueClick}
				title={'Glue'}
				Logo={Glue}
				active={true}
			/>
			<Button
				onClick={handleCapitaliseClick}
				title={'Capitalise'}
				Logo={Text}
				active={true}
			/>
		</div>
	);
};
export default PunctuationSection;

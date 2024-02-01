'use client';

import {
	createContext,
	Dispatch,
	MutableRefObject,
	ReactNode,
	SetStateAction,
	useEffect,
	useRef,
	useState
} from 'react';
import { PlayGeneral } from '@/lib/logic/packages/generals/play.general';
import { useSearchParams } from 'next/navigation';

interface PlayContextModel {
	generalRef: MutableRefObject<PlayGeneral>;
	updater: boolean;
	setUpdater: Dispatch<SetStateAction<boolean>>;
	selected: number;
	setSelected: Dispatch<SetStateAction<number>>;
	playerName: string;
	setPlayerName: Dispatch<SetStateAction<string>>;
	status: 'init' | 'idle' | 'solve' | 'revise' | 'finish' | 'correct';
	setStatus: Dispatch<
		SetStateAction<'init' | 'idle' | 'solve' | 'revise' | 'finish' | 'correct'>
	>;
	boolAnswer: boolean;
	setBoolAnswer: Dispatch<SetStateAction<boolean>>;
	right: number;
	setRight: Dispatch<SetStateAction<number>>;
	wrong: number;
	setWrong: Dispatch<SetStateAction<number>>;
	retries: number;
	setRetries: Dispatch<SetStateAction<number>>;
	fontSize: number;
	setFontSize: Dispatch<SetStateAction<number>>;
	expanded: boolean;
	setExpanded: Dispatch<SetStateAction<boolean>>;

	nextQuestion(): void;

	repeatQuestion(): void;

	answerQuestion(): void;

	beginRememberAndWrite(): void;
}

export const PlayContext = createContext<PlayContextModel | undefined>(
	undefined
);

export const PlayContextProvider = ({ children }: { children: ReactNode }) => {
	const generalRef = useRef<PlayGeneral>(new PlayGeneral());
	const [updater, setUpdater] = useState<boolean>(false);
	const [selected, setSelected] = useState<number>(-1);

	const [playerName, setPlayerName] = useState<string>('');

	const [status, setStatus] = useState<
		'init' | 'idle' | 'solve' | 'revise' | 'finish' | 'correct'
	>('init');

	const [boolAnswer, setBoolAnswer] = useState<boolean>(true);

	const [right, setRight] = useState<number>(0);
	const [wrong, setWrong] = useState<number>(0);
	const [retries, setRetries] = useState<number>(0);

	const [fontSize, setFontSize] = useState<number>(3);

	const [expanded, setExpanded] = useState<boolean>(false);

	const general = generalRef.current;

	const router = useSearchParams();

	const beginRememberAndWrite = () => {
		setStatus('solve');

		setUpdater(!updater);
	};

	useEffect(() => {
		if (status === 'finish') {
			fetch(`/api/player`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: playerName,
					result: `${right} right; ${wrong} wrong; ${retries} retries`,
					lessonID: router.get('id')
				})
			}).then(() => {
				console.log({
					name: playerName,
					result: `${right} right; ${wrong} wrong; ${retries} retries`,
					lessonID: router.get('id')
				});
			});
		}
	}, [right, wrong, retries, status]);

	const nextQuestion = () => {
		setStatus('correct');

		setTimeout(() => {
			if (general.currentPage + 1 === general.pages.length) {
				setStatus('finish');
				setUpdater(!updater);
				return;
			}

			general.currentPage++;
			general.playerAnswer = [];

			switch (general.type) {
				case 'l&w':
				case 'r|w':
					setStatus('solve');
					break;

				case 'r&w':
					setStatus('idle');
					break;
			}

			setUpdater(!updater);
		}, 1000);
	};

	const repeatQuestion = () => {
		setRetries(retries + 1);
		setWrong(wrong - 1);

		switch (general.type) {
			case 'l&w':
			case 'r|w':
				setStatus('solve');
				break;

			case 'r&w':
				setStatus('idle');
				general.playerAnswer = [];
				break;
		}

		setUpdater(!updater);
	};

	const answerQuestion = () => {
		let correct: boolean;

		switch (general.type) {
			case 'l&w':
			case 'r&w':
				correct = general.playerAnswer.join(' ') === general.answer.join(' ');
				break;

			case 'r|w':
				correct =
					boolAnswer === (general.pages[general.currentPage].data as boolean);
				break;
		}

		if (correct) {
			setRight(right + 1);
			nextQuestion();
		} else {
			setWrong(wrong + 1);
			setStatus('revise');
		}
	};

	return (
		<PlayContext.Provider
			value={{
				generalRef,
				updater,
				setUpdater,
				selected,
				setSelected,
				playerName,
				setPlayerName,
				status,
				setStatus,
				boolAnswer,
				right,
				setRight,
				wrong,
				setWrong,
				retries,
				setRetries,
				setBoolAnswer,
				nextQuestion,
				repeatQuestion,
				answerQuestion,
				beginRememberAndWrite,
				fontSize,
				setFontSize,
				expanded,
				setExpanded
			}}
		>
			{children}
		</PlayContext.Provider>
	);
};

import { useContext } from "react";
import { Glue, New, Trash, Save, Text } from "../../../assets/icons/icons-module";
import SimpleButton from "../../../components/SimpleButton/SimpleButton";
import Canvas from "./Canvas";
import { CreateContext } from "./CreateContext";
import Button from "../../../components/Button/Button";

const symbols = ['.', '?', ';', ',', '!', ':', '"', "'", '-'];

const TextMakerSideBar = () => {
	return (
		<>
			<PunctuationSection />
			<QuestionSection />
			<OtherSection />
		</>
	);
};

const PunctuationSection = () => {
	return (
		<div className='section'>
			<div className='symbols'>
				{symbols.map((symbol) => (
					<SimpleButton symbol={symbol} />
				))}
			</div>
			<Button title={'Glue'} Logo={Glue} active={true} />
			<Button title={'Capitalise'} Logo={Text} active={true} />
		</div>
	);
};

const QuestionSection = () => {
	return <div className='section'></div>;
};

const OtherSection = () => {
	const { setMode } = useContext(CreateContext)!;

	const handleCanvasMakerClick = () => {
		setMode('canvas');
	};

	return (
		<div className='section'>
			<Button title={'New page'} Logo={New} active={true} />
			<Button title={'Delete page'} Logo={Trash} active={true} />
			<Button onClick={handleCanvasMakerClick} title={'Canvas maker'} Logo={Canvas} active={true} />
			<Button title={'Save'} Logo={Save} active={true} />
		</div>
	);
};

export default TextMakerSideBar;

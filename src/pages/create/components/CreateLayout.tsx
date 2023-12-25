import { useContext } from "react";
import Canvas from "./Canvas";
import CanvasMakerSideBar from "./CanvasMakerSideBar";
import { CreateContext } from "./CreateContext";
import TextBox from "./TextBox";
import TextMakerSideBar from "./TextMakerSideBar";

const CreateLayout = () => {
	const { mode } = useContext(CreateContext)!;

	return (
		<div className='create'>
			<div className='board'>
				<Canvas />
				<TextBox />
			</div>
			<div className='side-bar'>
				{mode === 'canvas' ? <CanvasMakerSideBar /> : <TextMakerSideBar />}
			</div>
		</div>
	);
};

export default CreateLayout;
import {useRef} from "react";

const Create = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return <canvas className="canvas" ref={canvasRef}/>;
}

export default Create;
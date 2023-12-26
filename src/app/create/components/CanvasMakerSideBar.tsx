'use client';

import { extendTheme, Slider, ThemeProvider } from "@mui/joy";
import { useContext } from "react";
import { CreateContext } from "./CreateContext";
import ColorPicker from "../../../components/ColorPicker/ColorPicker";
import CustomSwitch from "../../../components/Switch";
import Button from "../../../components/Button/Button";
import {Eraser, Pen, Resize, Save, Stretch, Trash, Text} from "../../../../public/icons/icons-module";
import styles from '../page.module.scss';

const muiTheme = extendTheme({
  components: {
    JoySlider: {
      styleOverrides: {
        track: {
          background: "#004B88"
        },
        thumb: {
          "::before": {
            borderColor: "#004B88"
          }
        }
      }
    }
  }
});

const CanvasMakerSideBar = () => {
  return (
    <>
      <ColorSection />
      <CustomizationSection />
      <OtherSection />
    </>
  );
};

const ColorSection = () => {
  return (
    <div className="section">
      <ColorPicker />
      <div className={styles.doubleColor}>
        <label>Double color</label>
        <CustomSwitch />
      </div>
    </div>
  );
};

const CustomizationSection = () => {
  const { setSizingMode, sizingMode, pen, setPen, eraser, setEraser } = useContext(CreateContext)!;

  const handleStretchClick = () => {
    setSizingMode(sizingMode === "stretch" ? "scale" : "stretch");
  };

  const title = sizingMode === "stretch" ? "Stretch" : "Resize";
  const logo = sizingMode === "stretch" ? Stretch : Resize;

  const handlePenClick = () => {
    setPen(!pen);
  };

  const handleEraserClick = () => {
    setEraser(!eraser);
  };

  return (
    <div className="section">
      <Button onClick={handleStretchClick} title={title} Logo={logo} active />
      <label>Font size</label>
      <ThemeProvider theme={muiTheme}>
        <Slider defaultValue={3} min={1} max={4} step={1} valueLabelDisplay="auto" marks />
      </ThemeProvider>
      <Button onClick={handlePenClick} title={"Pen"} Logo={Pen} active={pen} />
      <Button onClick={handleEraserClick} title={"Eraser"} Logo={Eraser} active={eraser} />
    </div>
  );
};

const OtherSection = () => {
  const { setMode, generalRef } = useContext(CreateContext)!;

  const handleTextMakerClick = () => {
    setMode("text");
  };

  const handleSaveClick = () => {
  };

  const handleClearClick = () => {
    generalRef.current.clearPage();
  };

  return (
    <div className="section">
      <Button onClick={handleSaveClick} title={"Save"} Logo={Save} active />
      <Button onClick={handleTextMakerClick} title={'Text maker'} Logo={Text} active />
      <Button
        onClick={handleClearClick}
        title={"Clear page"}
        Logo={Trash}
        active={true}
        color={"#EB445A"}
      />
    </div>
  );
};

export default CanvasMakerSideBar;

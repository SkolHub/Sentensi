import "./Button.scss";
import { FunctionComponent, SVGProps } from "react";

const Button = (props: {
  title: string;
  Logo: FunctionComponent<SVGProps<SVGSVGElement>>;
  active: boolean;
  color?: string;
  onClick?: () => void;
}) => {
  const { title, Logo, active, color, onClick } = props;

  return (
    <div onClick={onClick} className={`button ${active ? "active" : "inactive"}`}>
      <Logo style={{
        fill: color,
        stroke: color
      }} />
      <label>{title}</label>
    </div>
  );
};

export default Button;

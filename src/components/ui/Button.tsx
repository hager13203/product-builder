import type { ReactNode } from "react";

interface IProps{
    children: ReactNode;
    className?:string;
    onClick?: ()=> void;
}
const Button = ({ children, className, onClick }: IProps) => {
  return <button className={`${className} w-full text-white rounded-md`} onClick={onClick}>{children}</button>;
};

export default Button;

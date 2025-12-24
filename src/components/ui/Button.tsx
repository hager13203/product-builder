import type { ReactNode } from "react";

interface IProps{
    children: ReactNode;
    className?:string;
}
const Button = ({ children, className }: IProps) => {
  return <button className={`${className} w-full text-white rounded-md`}>{children}</button>;
};

export default Button;

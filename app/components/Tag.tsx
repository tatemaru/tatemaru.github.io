import type { JSX } from "hono/jsx/jsx-runtime";

interface TagProps {
  children: JSX.Element | string;
  onClick?: () => void;
}

export const Tag = ({ children, onClick }: TagProps): JSX.Element => {
  return (
    <span 
      className="tag cursor-pointer" 
      onClick={onClick}
    >
      {children}
    </span>
  );
};
import type { JSX } from "hono/jsx/jsx-runtime";

interface TagButtonProps {
  onClick: () => void;
}

export const TagButton = ({ onClick }: TagButtonProps): JSX.Element => {
  return (
    <button 
      onClick={onClick}
      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
    >
      Tags
    </button>
  );
};
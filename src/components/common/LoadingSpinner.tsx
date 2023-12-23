import { ImSpinner2 } from "react-icons/im";

type LoadingSpinnerProps = {
  size?: "small" | "medium" | "large";
};

export default function LoadingSpinner({
  size = "medium",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl",
  };

  return (
    <span
      className={`text-center flex justify-center font-bold text-green-100 ${sizeClasses[size]}`}
    >
      <span className="transition-transform animate-spin ease-in-out">
        <ImSpinner2 />
      </span>
    </span>
  );
}

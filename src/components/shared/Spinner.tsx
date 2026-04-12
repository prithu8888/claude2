import './Toast.css';

interface SpinnerProps {
  size?: number;
}

export default function Spinner({ size = 16 }: SpinnerProps) {
  return (
    <span
      className="simple-spinner"
      style={{ width: size, height: size, borderWidth: size >= 20 ? 3 : 2 }}
    />
  );
}

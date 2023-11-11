export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`py-1 px-2 bg-background rounded block ${
        props.className ?? ''
      }`}
    />
  );
}

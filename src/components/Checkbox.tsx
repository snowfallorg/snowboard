export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Checkbox(props: CheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      className={`mb-1 px-2 bg-background rounded block ${
        props.className ?? ''
      }`}
    />
  );
}

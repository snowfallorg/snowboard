export type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type Colorway =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'success'
  | 'neutral';

export type Variant = 'solid' | 'outline' | 'text';

const baseButtonClassName = `inline-flex items-center justify-center rounded font-bold py-1 px-4 transition-colors gap-2`;

const colorwayClassNames: Record<Variant, Record<Colorway, string>> = {
  solid: {
    primary: 'bg-primary border border-transparent',
    secondary: 'bg-secondary border border-transparent',
    error: 'bg-error border border-transparent',
    warning: 'bg-warning border border-transparent',
    success: 'bg-success border border-transparent',
    neutral: 'bg-foreground text-background border border-transpraent',
  },
  outline: {
    primary:
      'border border-primary text-primary hover:bg-primary hover:bg-opacity-10',
    secondary:
      'border border-secondary text-secondary hover:bg-secondary hover:bg-opacity-10',
    error: 'border border-error text-error hover:bg-error hover:bg-opacity-10',
    warning:
      'border border-warning text-warning hover:bg-warning hover:bg-opacity-10',
    success:
      'border border-success text-success hover:bg-success hover:bg-opacity-10',
    neutral:
      'border border-foreground text-foreground hover:bg-foreground hover:bg-opacity-10',
  },
  text: {
    primary:
      'text-primary hover:bg-primary hover:bg-opacity-10 border border-transparent',
    secondary:
      'text-secondary hover:bg-secondary hover:bg-opacity-10 border border-transparent',
    error:
      'text-error hover:bg-error hover:bg-opacity-10 border border-transparent',
    warning:
      'text-warning hover:bg-warning hover:bg-opacity-10 border border-transparent',
    success:
      'text-success hover:bg-success hover:bg-opacity-10 border border-transparent',
    neutral:
      'text-foreground hover:bg-foreground hover:bg-opacity-10 border border-transparent',
  },
};

export function SolidButton(props: BaseButtonProps) {
  return (
    <button
      {...props}
      className={`${baseButtonClassName} ${props.className}`}
    />
  );
}

export function OutlineButton(props: BaseButtonProps) {
  return (
    <button
      {...props}
      className={`${baseButtonClassName} ${props.className}`}
    />
  );
}

export function TextButton(props: BaseButtonProps) {
  return (
    <button
      {...props}
      className={`${baseButtonClassName} ${props.className}`}
    />
  );
}

export interface ButtonProps extends BaseButtonProps {
  colorway?: Colorway;
  variant?: Variant;
}

export default function Button(props: ButtonProps) {
  const { variant = 'solid', colorway = 'primary', ...rest } = props;

  const className = `${colorwayClassNames[variant][colorway]} ${
    rest.className ?? ''
  }`;

  switch (variant) {
    case 'solid':
      return <SolidButton {...rest} className={className} />;
    case 'outline':
      return <OutlineButton {...rest} className={className} />;
    case 'text':
      return <TextButton {...rest} className={className} />;
  }
}

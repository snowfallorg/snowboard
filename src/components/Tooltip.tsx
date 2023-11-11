import * as RadixTooltip from '@radix-ui/react-tooltip';

export interface TooltipProps extends RadixTooltip.TooltipProps {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip(props: TooltipProps) {
  return (
    <RadixTooltip.Root {...props}>
      <RadixTooltip.Trigger>{props.children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          className={`bg-background-light py-1 px-2 rounded shadow ${
            props.className ?? ''
          }`}
        >
          {props.tooltip}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}

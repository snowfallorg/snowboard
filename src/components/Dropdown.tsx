import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Key } from 'react';

export interface DropdownItem extends DropdownMenu.MenuItemProps {
  key?: Key;
}

export interface DropdownProps {
  trigger: React.ReactNode | React.ReactNode[];
  TriggerProps?: DropdownMenu.DropdownMenuTriggerProps;
  ContentProps?: DropdownMenu.DropdownMenuContentProps;
  items: DropdownItem[];
}

export default function Dropdown(props: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger {...props.TriggerProps}>
        {props.trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-background-light p-1 rounded"
          {...props.ContentProps}
        >
          {props.items.map((item, i) => (
            <DropdownMenu.Item
              className={`flex items-center hover:bg-primary hover:text-[white] dark:hover:text-foreground-light py-1 px-2 rounded-sm cursor-pointer`}
              {...item}
              key={item.key ?? i}
            />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

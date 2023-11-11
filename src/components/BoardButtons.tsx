export interface BoardButtonsProps {
  children: React.ReactNode;
}

export default function BoardButtons(props: BoardButtonsProps) {
  return (
    <div className="absolute bottom-2 right-2 z-10 flex flex-col-reverse gap-2">
      {props.children}
    </div>
  );
}

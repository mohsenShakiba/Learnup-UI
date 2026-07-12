import { useDialogStore } from "./dialogStore";

export function DialogHost () {
  const Component = useDialogStore((state) => state.component);

  if (!Component) return null;

  return <Component />;
}

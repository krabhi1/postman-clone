import { ReactChildren } from "../../others/utils";

export type SidebarItemProps = ReactChildren & {
  icon: React.ReactNode;
};
export default function SidebarItem(props: SidebarItemProps) {
  return props.children;
}

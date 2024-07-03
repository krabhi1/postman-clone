import { ReactChildren } from "../../others/utils";

export type TabPanelHeaderTemplateOptions = {
  onClick?: () => void;
  isActive: boolean;
  index: number;
};
export type TabPanelProps = ReactChildren & {
  header?: string;
  headerTemplate?: (options: TabPanelHeaderTemplateOptions) => React.ReactNode;
  closable?: boolean;
};
export default function TabItem(props: TabPanelProps) {
  

  return <>{props.children}</>;
}

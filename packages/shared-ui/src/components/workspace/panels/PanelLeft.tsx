import CollectionsSidebarItem from "../sidebarItems/CollectionSidebarItem";
import { EnvSidebarItem } from "../sidebarItems/EnvSidebarItem";

export function PanelLeft({ index }: { index: number; }) {
  return (
    <div style={{ overflow: "hidden" }}>
      {index === 0 && <CollectionsSidebarItem />}
      {index === 1 && <EnvSidebarItem />}
    </div>
  );
}

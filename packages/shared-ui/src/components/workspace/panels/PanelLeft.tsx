import { EnvSidebarItem } from "../sidebarItems/EnvSidebarItem";
import { CollectionSidebarItem } from "../sidebarItems/CollectionSidebarItem";

export function PanelLeft({ index }: { index: number; }) {
  return (
    <div style={{ overflow: "hidden" }}>
      {index === 0 && <CollectionSidebarItem />}
      {index === 1 && <EnvSidebarItem />}
    </div>
  );
}

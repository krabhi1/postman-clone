import { memo, useEffect, useState } from "react";
import CollectionIcon from "../../icons/CollectionIcon";
import Splitter from "../Splitter";
import Sidebar from "../sidebar/Sidebar";
import SidebarItem from "../sidebar/SidebarItem";
import Split from "react-split";
import { TabViewExample } from "../tab/TabView";
import { useLiveStore } from "../../configs/liveblocks.config";
import { useShallow } from "zustand/react/shallow";
import StarIcon from "../../icons/StarIcon";
import { PanelLeft } from "./panels/PanelLeft";
import { PanelRight } from "./panels/PanelRight";

function Content({ index }: { index: number | undefined }) {
  useEffect(() => {
    console.log("Content2 mounted");
  }, []);

  if (index === undefined) return <PanelRight />;

  return (
    <Split
      sizes={[30, 70]}
      className="split"
      gutterSize={1}
      snapOffset={[150, 0]}
      minSize={[0, 200]}
    >
      <PanelLeft index={index} />
      <PanelRight />
    </Split>
  );
}

export default function WorkspaceMain() {
  const [leftSidebarIndex, setLeftSidebarIndex] = useState<
    number | undefined
  >();
  return (
    <div className="main">
      {/* left sidebar */}
      <Sidebar
        noContent
        activeIndex={leftSidebarIndex}
        onItemChange={(i) => setLeftSidebarIndex(i)}
      >
        <SidebarItem icon={<CollectionIcon />} />
        <SidebarItem icon={<StarIcon />} />
      </Sidebar>
      {/* left sidebar panel */}
      {/* editor => tab  */}

      <Content index={leftSidebarIndex} />
    </div>
  );
}

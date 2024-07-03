import { memo, useEffect, useState } from "react";
import CollectionIcon from "../../icons/CollectionIcon";
import Splitter from "../Splitter";
import Sidebar from "../sidebar/Sidebar";
import SidebarItem from "../sidebar/SidebarItem";
import Split from "react-split";
import TabView, { TabViewExample } from "../tab/TabView";
import TabItem from "../tab/TabItem";
function PanelA() {
  return (
    <div style={{ overflow: "hidden" }}>Render based on left sidebar index</div>
  );
}

function PanelB() {
  return (
    <TabView>
      <TabItem closable={false} header="Tab 1">
        Content 1
      </TabItem>
      <TabItem closable={false} header="Tab 2">
        Content 2
      </TabItem>
      <TabItem closable={false} header="Tab 3">
        Content 3
      </TabItem>
    </TabView>
  );
}
function Content2({ index }: { index: number | undefined }) {
  useEffect(() => {
    console.log("Content2 mounted");
  }, []);

  if (index === undefined) return <PanelB />;

  return (
    <Split
      className="split"
      gutterSize={1}
      snapOffset={[200, 0]}
      minSize={[0, 200]}
    >
      <PanelA />
      <PanelB />
    </Split>
  );
}
export default function Main() {
  const [leftSidebarIndex, setLeftSidebarIndex] = useState<
    number | undefined
  >();

  useEffect(() => {
    console.log("Main mounted");
  }, []);

  return (
    <div className="main">
      {/* left sidebar */}
      <Sidebar
        noContent
        activeIndex={leftSidebarIndex}
        onItemChange={(i) => setLeftSidebarIndex(i)}
      >
        <SidebarItem icon={<CollectionIcon />} />
        <SidebarItem icon={<CollectionIcon />} />
      </Sidebar>
      {/* left sidebar panel */}
      {/* editor => tab  */}

      <Content2 index={leftSidebarIndex} />
    </div>
  );
}

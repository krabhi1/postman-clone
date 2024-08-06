import Split from "react-split";
import { ReactChildren } from "../others/utils";
import "../styles/splitter.css";
import Sidebar from "./sidebar/Sidebar";
import { useState } from "react";
import CollectionIcon from "../icons/CollectionIcon";
import SidebarItem from "./sidebar/SidebarItem";
export type SplitterProps = ReactChildren & {
  noSplit?: boolean;
};



export default function Splitter(props: SplitterProps) {
  const [percent, setPercent] = useState<number[]>([50, 50]);
  if (props.noSplit) {
    return <>{props.children}</>;
  }
  console.log(percent);
  return (
    <Split
      gutterSize={1}
      snapOffset={[200, 0]}
      minSize={[0, 100]}
      sizes={percent}
      onDragEnd={(e) => setPercent(e)}
      className="split"
    >
      {props.children}
    </Split>
  );
}

export function SplitterExample() {
  const [index, setIndex] = useState<number | undefined>(0);
  return (
    <Splitter noSplit={index == undefined}>
      <Sidebar activeIndex={index} onItemChange={(i) => setIndex(i)}>
        <SidebarItem icon={<CollectionIcon />}>
          <div>Item 1</div>
        </SidebarItem>
        <SidebarItem icon={<CollectionIcon />}>
          <div>Item 2</div>
        </SidebarItem>
      </Sidebar>
      <div>2</div>
    </Splitter>
  );
}



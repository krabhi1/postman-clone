import { Children, ReactElement, useEffect } from "react";
import CollectionIcon from "../../icons/CollectionIcon";
import { ReactChildren } from "../../others/utils";
import { FixedBox } from "../List";
import SidebarItem, { SidebarItemProps } from "./SidebarItem";
import React from "react";
import "../../styles/sidebar.css";

export type SidebarProps = ReactChildren & {
  activeIndex?: number;
  onItemChange?: (index?: number) => void;
  noContent?: boolean;
};

export default function Sidebar({
  noContent,
  activeIndex,
  ...props
}: SidebarProps) {
  const [index, setIndex] = React.useState(activeIndex);
  useEffect(() => {
    if (activeIndex != index) handleOnItemClick(activeIndex);
  }, [activeIndex]);
  const items = Children.toArray(props.children).filter(
    (e): e is ReactElement<SidebarItemProps> => {
      const child = e as ReactElement<SidebarItemProps>;
      if (React.isValidElement(child) && child.type === SidebarItem) {
        return true;
      }
      return false;
    }
  );
  function handleOnItemClick(i?: number) {
    const _index = i === index ? undefined : i;
    setIndex(_index);
    props.onItemChange?.(_index);
  }
  function RenderContent() {
    if (index === undefined) return null;
    if (index >= 0 && index < items.length) return items[index];
    return null;
  }

  return (
    <div
      className="sidebar"
      style={{
        width: noContent
          ? "fit-content"
          : index === undefined
            ? "fit-content"
            : "100%",
      }}
    >
      {/* icons */}
      <div className="header">
        {items.map((item, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              className={`icon ${active ? "active" : ""}`}
              onClick={() => {
                handleOnItemClick(i);
              }}
            >
              {item.props.icon}
            </button>
          );
        })}
      </div>
      {/* panel */}
      {!noContent && (
        <div className="content">
          <RenderContent />
        </div>
      )}
    </div>
  );
}

export function SidebarExample() {
  return (
    <FixedBox style={{ width: "100%", height: "250px" }}>
      <Sidebar activeIndex={0}>
        <SidebarItem icon={<CollectionIcon />}>
          <div>Item 1</div>
        </SidebarItem>
        <SidebarItem icon={<CollectionIcon />}>
          <div>Item 2</div>
        </SidebarItem>
      </Sidebar>
    </FixedBox>
  );
}

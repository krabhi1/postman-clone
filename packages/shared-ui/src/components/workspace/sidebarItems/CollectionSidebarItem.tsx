import { Collection, CollectionItem, FolderItem } from "common-utils/types";
import { useLiveStore } from "../../../configs/liveblocks.config";
import "../../../styles/editor.css";
import ArrowRightIcon from "../../../icons/ArrowRightIcon";
import { useEffect, useState } from "react";
export function CollectionSidebarItem() {
  const [data,setData]=useState(_data)
  const [activeNodeId,setActiveNodeId]=useState<string>()
  
  return (
    <div className="coll-panel">
      <button>New Collection</button>
      <Tree nodes={_data} activeNodeId={activeNodeId}
      onActiveNodeChange={(node)=>{
        console.log("active node",node)
      }}
      />
    </div>
  );
}

type Node<T = any> = {
  id: string;
  children?: Node<T>[];
  data: T;
  name: string;
  isOpen?: boolean;
  renderNodeTemplate?: (node: Node<T>) => React.ReactNode;
};

export type CollNodeType = "folder" | "collection" | "request";
export type CollNode = Node<{ type: CollNodeType }>;

type CommonProps<T> = {
  activeNodeId?: string;
  onNodeClick?: (node: Node<T>) => void;
  onToggle?: (node: Node<T>) => void;
  onActiveNodeChange?: (node: Node<T>) => void;
};
export type NodeProps<T> = CommonProps<T> & {
  nodes: Node<T>[];
};
type RenderTreeNodeProps<T> = CommonProps<T> & {
  node: Node<T>;
  times: number;
};
function RenderTreeNode<T>({ node, ...props }: RenderTreeNodeProps<T>) {
  return (
    <div className="node">
      <div
        className={"node-head" + (node.children ? "" : "")}
        style={{ paddingLeft: `${props.times * 2 + 1}rem` }}
      >
        {node.children && (
          <ArrowRightIcon
            className={`icon-arrow ${node.isOpen ? "open" : ""}`}
          />
        )}
        <span>{node.name}</span>
      </div>
      {node.children && (
        <div className="node-children">
          {node.children.map((child) => (
            <RenderTreeNode
              key={child.id}
              node={child}
              times={props.times + 1}
            />
          ))}
          <span
            className="line"
            style={{ left: `calc(${props.times * 2 + 1}rem + 10px)` }}
          ></span>
        </div>
      )}
    </div>
  );
}
function Tree<T>(props: NodeProps<T>) {
  return (
    <div className="tree">
      <div>
        {props.nodes.map((node) => (
          <RenderTreeNode key={node.id} node={node} {...props} times={0} />
        ))}
      </div>
    </div>
  );
}

const collections: Collection[] = [];
// @ts-ignore
const collNodes: CollNode[] = collections.map((coll) => {
  const toNode = (items: CollectionItem[]) => {
    return items.map((item) => {
      let children: CollNode[] = [];
      if (item.type === "folder") {
        const folder = item as FolderItem;
        children = toNode(folder.items);
      }
      return {
        id: item.id,
        children: children,
        data: { type: item.type },
        name: item.name,
      };
    });
  };
  return {
    id: coll.id,
    children: coll.items.map((item) => {
      item.type;
      return {
        id: item.id,
        children: [],
        data: { type: "request" },
      };
    }),
    data: { type: "collection" },
    name: coll.name,
  };
});

const _data: CollNode[] = [
  {
    id: "1",
    name: "root",
    children: [
      {
        id: "2",
        name: "child1",
        children: [],
        data: { type: "folder" },
      },
      {
        id: "3",
        name: "child2",
        children: [],
        data: { type: "collection" },
      },
    ],
    data: { type: "folder" },
  },
  {
    id: "2",
    name: "root2",
    children: [
      {
        id: "5",
        name: "child3",
        data: { type: "request" },
      },
    ],
    data: { type: "collection" },
  },
  {
    id: "3",
    name: "root3",
    children: [
      {
        id: "6",
        name: "child4",
        data: { type: "request" },
      },
      //folder
      {
        id: "7",
        name: "child5",
        children: [
          {
            id: "8",
            name: "child6",
            data: { type: "request" },
          },
        ],
        data: { type: "folder" },
      },
    ],
    data: { type: "collection" },
  },
];

import DeleteIcon from "../icons/svg/DELETE.svg";
import GetIcon from "../icons/svg/GET.svg";
import PostIcon from "../icons/svg/POST.svg";
import PutIcon from "../icons/svg/PUT.svg";
import PatchIcon from "../icons/svg/PATCH.svg";
import HeadIcon from "../icons/svg/HEAD.svg";
import OptionsIcon from "../icons/svg/OPTIONS.svg";
import FolderIcon from "../icons/FolderIcon";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import MoreHoriIcon from "../icons/MoreHoriIcon";
import "../styles/tree.css";
import { Menu, MenuHandle } from "./Menu";
import { useRef, useState } from "react";

export type Node<T = any> = {
  id: string;
  children?: Node<T>[];
  data: T;
  name: string;
  isOpen?: boolean;
  renderNodeTemplate?: (node: Node<T>) => React.ReactNode;
};

export type CollNodeType = "folder" | "collection" | "request";
export type CollNode = Node<{ type: CollNodeType; subtype?: string }>;

type CommonProps<T> = {
  activeNodeId?: string;
  onNodeClick?: (node: Node<T>) => void;
  onToggle?: (node: Node<T>) => void;
  // onActiveNodeChange?: (node: Node<T>) => void;
  optionMenuListCallback?: (node: Node<T>) => string[];
  onOptionMenuSelect?: (node: Node<T>, option: string) => void;
};
export type NodeProps<T> = CommonProps<T> & {
  nodes: Node<T>[];
};

const items = ["delete", "duplicate", "rename"];

export default function Tree<T>(props: NodeProps<T>) {
  const targetRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<MenuHandle>(null);
  const [menuItems, setMenuItems] = useState<string[]>([]);
  const [prevClickMoreNodeId, setPrevClickMoreNodeId] = useState<string>();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeHoverNodeId, setActiveHoverNodeId] = useState<string>();
  console.log({ targetRef });
  return (
    <>
      <div className="tree">
        <div>
          {props.nodes.map((node) => (
            <RenderTreeNode
              onMoreClick={(node) => {
                setMenuItems(props.optionMenuListCallback?.(node) || []);
                const rect = targetRef.current?.getBoundingClientRect();
                if (rect) {
                  setPosition({ x: rect.left, y: rect.top });
                }
                console.log("more click", targetRef.current);
                if (prevClickMoreNodeId && node.id === prevClickMoreNodeId) {
                  menuRef.current?.toggle();
                } else {
                  menuRef.current?.show();
                }
                setPrevClickMoreNodeId(node.id);
              }}
              key={node.id}
              node={node}
              times={0}
              targetRef={targetRef}
              hoverNodeId={activeHoverNodeId}              
              onNodeHover={(node) => {
                setActiveHoverNodeId(node.id);
                console.log("hover", node);
              }}
              {...props}
            />
          ))}
        </div>
      </div>
      <Menu ref={menuRef} items={menuItems} position={position} />
    </>
  );
}

type RenderTreeNodeProps<T> = CommonProps<T> & {
  node: Node<T>;
  times: number;
  targetRef?: React.RefObject<HTMLDivElement>;
  hoverNodeId?: string;
  onMoreClick?: (node: Node<T>) => void;
  onNodeHover?: (node: Node<T>) => void;
};
function RenderTreeNode<T>({ node, ...props }: RenderTreeNodeProps<T>) {
  function handleMoreClick() {
    props.onMoreClick?.(node);
  }
  const isActive = props.activeNodeId === node.id;
  const isHover = props.hoverNodeId === node.id;
  return (
    <div className="node">
      <div
        className={`node-head ${props.activeNodeId === node.id ? "active" : ""}`}
        style={{ paddingLeft: `${props.times * 2 + 1}rem` }}
        onClick={() => {
          props.onNodeClick?.(node);
        }}
        onMouseEnter={() => {
          props.onNodeHover?.(node);
        }}
      >
        {node.children ? (
          <span
            className="icon-arrow-wrap"
            onClick={(e) => {
              e.stopPropagation();
              props.onToggle?.(node);
            }}
          >
            <ArrowRightIcon
              className={`icon-arrow ${node.isOpen ? "open" : ""}`}
            />
          </span>
        ) : (
          <div></div>
        )}
        {getIcon(node)}
        <span>{node.name}</span>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleMoreClick();
          }}
          className="right"
          ref={isHover ? props.targetRef : undefined}
        >
          <MoreHoriIcon />
        </div>
      </div>
      {node.children && node.isOpen && (
        <div className="node-children">
          {node.children.map((child) => (
            <RenderTreeNode
              {...props}
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

export function getIcon(node: Node) {
  let type = node.data.type as string;
  if (node.data.type == "request") {
    type = node.data.subtype!;
  }
  switch (type) {
    case "folder":
      return <FolderIcon />;
    case "get":
      return <img src={GetIcon} />;
    case "post":
      return <img src={PostIcon} />;
    case "put":
      return <img src={PutIcon} />;
    case "delete":
      return <img src={DeleteIcon} />;
    case "patch":
      return <img src={PatchIcon} />;
    case "head":
      return <img src={HeadIcon} />;
    case "options":
      return <img src={OptionsIcon} />;
    default:
      return <span></span>;
  }
}

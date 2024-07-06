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

export default function Tree<T>(props: NodeProps<T>) {
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

type RenderTreeNodeProps<T> = CommonProps<T> & {
  node: Node<T>;
  times: number;
};
function RenderTreeNode<T>({ node, ...props }: RenderTreeNodeProps<T>) {
  return (
    <div className="node">
      <div
        className={`node-head ${props.activeNodeId === node.id ? "active" : ""}`}
        style={{ paddingLeft: `${props.times * 2 + 1}rem` }}
        onClick={() => {
          props.onNodeClick?.(node);
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
        <div className="right">
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

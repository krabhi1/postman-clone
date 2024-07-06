import {
  Collection,
  CollectionItem,
  FolderItem,
  RequestItem,
} from "common-utils/types";
import {
  useLiveStore,
  useWorkspaceState,
} from "../../../configs/liveblocks.config";
import "../../../styles/editor.css";
import ArrowRightIcon from "../../../icons/ArrowRightIcon";
import { useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import DeleteIcon from "../../../icons/svg/DELETE.svg";
import GetIcon from "../../../icons/svg/GET.svg";
import PostIcon from "../../../icons/svg/POST.svg";
import PutIcon from "../../../icons/svg/PUT.svg";
import PatchIcon from "../../../icons/svg/PATCH.svg";
import HeadIcon from "../../../icons/svg/HEAD.svg";
import OptionsIcon from "../../../icons/svg/OPTIONS.svg";
import FolderIcon from "../../../icons/FolderIcon";
import { useShallow } from "zustand/react/shallow";
import { useLocalState, useLocalStore } from "../../../store/app.store";
import MoreHoriIcon from "../../../icons/MoreHoriIcon";

export default function CollectionsSidebarItem() {
  const [activeNodeId, setActiveNodeId] = useState<string>();
  const { collections = [], addCollection } = useLiveStore(
    useShallow((state) => ({
      collections: state.workspaceState?.collections,
      addCollection: state.addNewCollection,
    }))
  );
  const { local, updateLocal, getLocal } = useLocalStore(
    useShallow((state) => ({
      local: state.local,
      updateLocal: state.updateLocal,
      getLocal: state.getLocal,
    }))
  );

  const data = useMemo<CollNode[]>(() => {
    console.log("recall data");
    return collections.map((coll) => {
      const toNode = (items: CollectionItem[]) => {
        return items.map((item) => {
          let children: CollNode[] | undefined = undefined;
          let subtype: string | undefined;
          if (item.type === "folder") {
            const folder = item as FolderItem;
            children = toNode(folder.items) as CollNode[];
          } else {
            subtype = (item as RequestItem).method.toLowerCase();
          }
          return {
            id: item.id,
            children: children,
            data: { type: item.type, subtype },
            name: item.name,
            isOpen: getLocal(item.id).isOpen,
          } as CollNode;
        }) as CollNode[];
      };
      return {
        id: coll.id,
        children: toNode(coll.items),
        data: { type: "collection" },
        name: coll.name,
        isOpen: getLocal(coll.id).isOpen,
      };
    });
  }, [local, collections]);

  console.log({ collections, data });

  useEffect(() => {
    console.log("local", local);
  }, [local]);

  return (
    <div className="coll-panel">
      <button onClick={()=>addCollection("New Collection "+collections.length)}>New Collection</button>
      <Tree
        nodes={data}
        activeNodeId={activeNodeId}
        onNodeClick={(node) => {
          setActiveNodeId(node.id);
          console.log("node clicked", node);
        }}
        onToggle={(node) => {
          updateLocal(node.id, { isOpen: !node.isOpen });
        }}
      />
    </div>
  );
}
function findNode(id: string, nodes: CollNode[]) {
  let node: CollNode | undefined;
  function find(nodes: CollNode[]) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        node = nodes[i];
        break;
      }
      const child = nodes[i].children;
      if (child) {
        find(child);
      }
    }
  }
  find(nodes);
  return node;
}

export function _CollectionSidebarItem() {
  const [data, setData] = useImmer(_data);
  const [activeNodeId, setActiveNodeId] = useState<string>();

  return (
    <div className="coll-panel">
      <button>New Collection</button>
      <Tree
        nodes={data}
        activeNodeId={activeNodeId}
        onNodeClick={(node) => {
          setActiveNodeId(node.id);
          console.log("node clicked", node);
        }}
        onToggle={(node) => {
          setData((draft) => {
            const n = findNode(node.id, draft);
            if (n) {
              n.isOpen = !n.isOpen;
            }
          });
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

function getIcon(node: Node) {
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

const collections: Collection[] = [];
// @ts-ignore
const collNodes: CollNode[] = collections.map((coll) => {
  const toNode = (items: CollectionItem[]) => {
    return items.map((item) => {
      let children: CollNode[] | undefined = undefined;
      if (item.type === "folder") {
        const folder = item as FolderItem;
        children = toNode(folder.items) as CollNode[];
      }
      return {
        id: item.id,
        children: children,
        data: { type: item.type },
        name: item.name,
      } as CollNode;
    }) as CollNode[];
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
        data: { type: "folder" },
      },
    ],
    data: { type: "collection" },
  },
  {
    id: "20",
    name: "root2",
    children: [
      {
        id: "5",
        name: "child3",
        data: { type: "request", subtype: "get" },
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
        data: { type: "request", subtype: "post" },
      },
      //folder
      {
        id: "7",
        name: "child5",
        children: [
          {
            id: "8",
            name: "child6",
            data: { type: "request", subtype: "delete" },
          },
        ],
        data: { type: "folder" },
      },
    ],
    data: { type: "collection" },
  },
];

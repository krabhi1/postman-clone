import { CollectionItem, FolderItem, RequestItem } from "common-utils/types";
import { useLiveStore } from "../../../configs/liveblocks.config";
import "../../../styles/editor.css";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useLocalStore } from "../../../store/app.store";
import Tree, { CollNode } from "../../Tree";
import { Menu } from "../../Menu";

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

  return (
    <div className="coll-panel">
      <button
        onClick={() => addCollection("New Collection " + collections.length)}
      >
        New Collection
      </button>
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
        optionMenuListCallback={(node) => {
          return ["delete", "rename",node.name,node.id];
        }}
      />
    </div>
  );
}

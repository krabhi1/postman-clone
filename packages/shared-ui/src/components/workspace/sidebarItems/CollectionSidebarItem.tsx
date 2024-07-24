import {
  CollectionItem,
  FolderItem,
  HttpMethod,
  RequestItem,
} from "common-utils/types";
import { useLiveStore } from "../../../configs/liveblocks.config";
import "../../../styles/editor.css";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { EditorTabItemState, useLocalStore } from "../../../store/app.store";
import Tree, { Node } from "../../Tree";
import { Menu } from "../../Menu";
export type CollNodeType = "FOLDER" | "REQUEST" | "COLLECTION";
export type CollNode = Node<{
  type: CollNodeType;
  subtype?: HttpMethod;
  collectionId: string;
}>;
export default function CollectionsSidebarItem() {
  const {
    collections = [],
    addCollection,
    addRequest,
    addFolder,
    deleteItem,
    duplicateItem,
  } = useLiveStore(
    useShallow((state) => ({
      collections: state.workspaceState?.collections,
      addCollection: state.addNewCollection,
      addRequest: state.addRequest,
      addFolder: state.addFolder,
      deleteItem: state.deleteItem,
      duplicateItem: state.duplicateItem,
    }))
  );
  const { addAndOpen, setLocal, getLocal, local } = useLocalStore(
    useShallow((state) => ({
      addAndOpen: state.addEditorTabAndSetAsActive,
      setLocal: state.setLocal,
      getLocal: state.getLocal,
      local: state.local,
    }))
  );

  const data = useMemo<CollNode[]>(() => {
    return collections.map((coll) => {
      const toNode = (items: CollectionItem[]) => {
        return items.map((item) => {
          let children: CollNode[] | undefined = undefined;
          let subtype: string | undefined;
          if (item.type === "folder") {
            const folder = item as FolderItem;
            children = toNode(folder.items) as CollNode[];
          } else {
            subtype = (item as RequestItem).method;
          }
          const type = item.type.toUpperCase() as CollNodeType;
          const localState = getLocal<{ isOpen: boolean }>(item.id) || {
            isOpen: true,
          };
          return {
            id: item.id,
            children: children,
            data: { type, subtype, collectionId: coll.id },
            name: item.name,
            isOpen: localState.isOpen,
          } as CollNode;
        }) as CollNode[];
      };
      const localState = getLocal<{ isOpen: boolean }>(coll.id) || {
        isOpen: true,
      };
      return {
        id: coll.id,
        children: toNode(coll.items),
        data: { type: "COLLECTION", collectionId: coll.id },
        name: coll.name,
        isOpen: localState.isOpen,
      };
    });
  }, [collections, local]);

  function handleOptionMenuSelect(node: CollNode, option: string) {
    const collectionId =
      node.data.type === "COLLECTION" ? node.id : node.data.collectionId;
    const itemId = node.data.type === "COLLECTION" ? undefined : node.id;
    const type = node.data.type;
    const subtype = node.data.subtype;

    console.log("option", option, node);

    switch (option) {
      //all case
      case "rename":
        break;
      case "duplicate":
        duplicateItem(collectionId, itemId);
        break;
      case "new folder":
        addFolder(collectionId, "New Folder", itemId);
        break;
      case "new request":
        addRequest(collectionId, "New Request", itemId);
        break;
      case "open":
        addAndOpen({
          id: itemId || collectionId,
          type: type,
          name: node.name,
          data: { subtype, collectionId },
        });
        break;
      case "delete":
        deleteItem(collectionId, itemId);
        break;
      case "send":
        break;
    }
  }
  function openNode(node: CollNode) {
    const collectionId =
      node.data.type === "COLLECTION" ? node.id : node.data.collectionId;
    const itemId = node.data.type === "COLLECTION" ? undefined : node.id;
    const type = node.data.type;
    const subtype = node.data.subtype;
    addAndOpen({
      id: itemId || collectionId,
      type: type,
      name: node.name,
      data: { subtype, collectionId },
    });
  }

  function handleToggle(node: CollNode) {
    setLocal(node.id, { isOpen: !node.isOpen });
  }
  function handleNodeClick(node: CollNode) {
    setActiveNodeId(node.id);
    openNode(node);
  }
  function handleAddCollection() {
    addCollection("New Collection " + collections.length);
  }
  const [activeNodeId, setActiveNodeId] = useState<string>();

  return (
    <div className="coll-panel">
      <button onClick={handleAddCollection}>New Collection</button>
      <Tree
        nodes={data}
        activeNodeId={activeNodeId}
        onNodeClick={handleNodeClick}
        onToggle={handleToggle}
        optionMenuListCallback={(node) => {
          let type = node.data.type;
          const common = ["open", "delete", "duplicate", "rename"];
          if (type === "COLLECTION") {
            return ["new folder", "new request", ...common];
          }
          if (type === "FOLDER") {
            return ["new folder", "new request", ...common];
          }
          if (type === "REQUEST") {
            return ["send", ...common];
          }
          return [];
        }}
        onOptionMenuSelect={handleOptionMenuSelect}
      />
    </div>
  );
}

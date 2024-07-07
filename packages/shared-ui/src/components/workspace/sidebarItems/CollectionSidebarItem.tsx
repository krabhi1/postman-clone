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
import { EditorMainTab, useLocalStore } from "../../../store/app.store";
import Tree, { Node } from "../../Tree";
import { Menu } from "../../Menu";
export type CollNodeType = "FOLDER" | "REQUEST" | "COLLECTION";
export type CollNode = Node<{
  type: CollNodeType;
  subtype?: HttpMethod;
  collectionId: string;
}>;
export default function CollectionsSidebarItem() {
  const [activeNodeId, setActiveNodeId] = useState<string>();

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
  const { local, updateLocal, getLocal, addAndOpen } = useLocalStore(
    useShallow((state) => ({
      local: state.local,
      updateLocal: state.updateLocal,
      getLocal: state.getLocal,
      addAndOpen: state.addEditorTabAndSetAsActive,
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
            subtype = (item as RequestItem).method;
          }
          const type = item.type.toUpperCase() as CollNodeType;
          return {
            id: item.id,
            children: children,
            data: { type, subtype, collectionId: coll.id },
            name: item.name,
            isOpen: getLocal(item.id).isOpen,
          } as CollNode;
        }) as CollNode[];
      };
      return {
        id: coll.id,
        children: toNode(coll.items),
        data: { type: "COLLECTION", collectionId: coll.id },
        name: coll.name,
        isOpen: getLocal(coll.id).isOpen,
      };
    });
  }, [local, collections]);

  function handleOptionMenuSelect(node: CollNode, option: string) {
    const collectionId =
      node.data.type === "COLLECTION" ? node.id : node.data.collectionId;
    const itemId = node.data.type === "COLLECTION" ? undefined : node.id;
    const type = node.data.type;
    const subtype = node.data.subtype || "";
    const openType = (
      type == "REQUEST" ? subtype : type
    ).toUpperCase() as EditorMainTab["type"];

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
          type: openType,
          name: node.name,
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
    console.log("open node", node);
    const type =
      node.data.type == "COLLECTION" || node.data.type == "FOLDER"
        ? node.data.type
        : node.data.subtype || ("" as EditorMainTab["type"]);
    addAndOpen({
      id: node.id,
      type,
      name: node.name,
    });
  }
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
          openNode(node);
        }}
        onToggle={(node) => {
          updateLocal(node.id, { isOpen: !node.isOpen });
        }}
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

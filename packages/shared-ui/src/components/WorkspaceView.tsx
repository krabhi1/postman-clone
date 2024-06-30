import { FolderLocalState, localStore, useLiveStore, useLocalState } from "common-store";
import { isValidEmail } from "common-utils";
import {
  FolderItem,
  RequestItem,
  CollectionItem,
  Collection,
  ServerWorkspace,
} from "common-utils/types";
import React, { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

const FolderItemView = React.memo(
  ({ item, collectionId }: { item: FolderItem; collectionId: string }) => {
    const { addRequest, addFolder, deleteItem } = useLiveStore(
      useShallow((state) => ({
        addRequest: state.addRequest,
        addFolder: state.addFolder,
        deleteItem: state.deleteItem,
      }))
    );

    const localState = useLocalState<FolderLocalState>(item.id, "folder");

    return (
      <div className="box list folder">
        <div className="title-2">Folder({item.name})</div>
        <div>{item.description}</div>
        <div className="box list-h">
          <button
            onClick={() => {
              addRequest(collectionId, "New Request", item.id);
            }}
          >
            Add Request
          </button>
          <button
            onClick={() => {
              addFolder(collectionId, "New Folder", item.id);
            }}
          >
            Add Folder
          </button>
          <button onClick={() => deleteItem(collectionId, item.id)}>
            Delete
          </button>
          <button
            onClick={() => {
              localStore
                .getState()
                .updateLocal(item.id, { isOpen: !localState.isOpen });
            }}
          >
            Toggle
          </button>
        </div>
        {localState.isOpen && (
          <>
            {item.items.map((item) => (
              <CollectionItemView
                key={item.id}
                item={item}
                collectionId={collectionId}
              />
            ))}
          </>
        )}
      </div>
    );
  }
);

const AutoInputText = React.memo(
  (props: { value: string; onChange: (value: string) => void }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    //on click outside remove focus of input
    useEffect(() => {
      if (isEditing) {
        const handleClickOutside = (e: MouseEvent) => {
          if (
            inputRef.current &&
            !inputRef.current.contains(e.target as Node)
          ) {
            setIsEditing(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        inputRef.current?.focus();
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [isEditing]);

    return (
      <>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            onBlur={() => {
              console.log("blur");
              setIsEditing(false);
            }}
            onFocus={(e) => setIsEditing(true)}
          />
        ) : (
          <div onClick={() => setIsEditing(true)}>{props.value}</div>
        )}
      </>
    );
  }
);

const RequestItemView = React.memo(
  ({ item, collectionId }: { item: RequestItem; collectionId: string }) => {
    const { deleteItem, updateItem } = useLiveStore(
      useShallow((state) => ({
        addRequest: state.addRequest,
        addFolder: state.addFolder,
        deleteItem: state.deleteItem,
        updateItem: state.updateItem,
      }))
    );
    return (
      <div className="box list request">
        <div className="title-2">Request({item.name})</div>
        {/* <div>{item.description}</div> */}
        <AutoInputText
          value={item.description}
          onChange={(value) => {
            updateItem(collectionId, { description: value }, item.id);
          }}
        />
        <AutoInputText
          value={item.url}
          onChange={(value) => {
            updateItem(collectionId, { url: value }, item.id);
          }}
        />
        <div>{item.method}</div>
        <div className="box list-h">
          <button onClick={() => deleteItem(collectionId, item.id)}>
            Delete
          </button>
        </div>
      </div>
    );
  }
);
const CollectionItemView = React.memo(
  ({ item, collectionId }: { item: CollectionItem; collectionId: string }) => {
    return (
      <>
        {item.type === "folder" ? (
          <FolderItemView
            item={item as FolderItem}
            collectionId={collectionId}
          />
        ) : (
          <RequestItemView
            item={item as RequestItem}
            collectionId={collectionId}
          />
        )}
      </>
    );
  }
);

const CollectionItemListView = React.memo(
  ({
    items,
    collection,
  }: {
    items: CollectionItem[];
    collection: Collection;
  }) => {
    if (items.length === 0) return <> </>;
    return (
      <div className="box list">
        <div className="title-2">Items</div>
        {items.map((item) => (
          <CollectionItemView
            key={item.id}
            item={item}
            collectionId={collection.id}
          />
        ))}
      </div>
    );
  }
);

const CollectionView = React.memo(
  ({ collection }: { collection: Collection }) => {
    const { addRequest, addFolder, deleteItem } = useLiveStore(
      useShallow((state) => ({
        addRequest: state.addRequest,
        addFolder: state.addFolder,
        deleteItem: state.deleteItem,
      }))
    );
    return (
      <div className="box list collection">
        <div className="title-2">Collection({collection.name})</div>
        <div>{collection.description}</div>

        <div className="list-h box">
          <button
            onClick={() => {
              addRequest(collection.id, "New Request");
            }}
          >
            Add Request
          </button>
          <button
            onClick={() => {
              addFolder(collection.id, "New Folder");
            }}
          >
            Add Folder
          </button>
          <button onClick={() => deleteItem(collection.id)}>Delete</button>
        </div>
        <CollectionItemListView
          items={collection.items}
          collection={collection}
        />
      </div>
    );
  }
);

const CollectionListView = React.memo(
  ({ collections }: { collections: Collection[] }) => {
    if (collections.length === 0) return <> </>;
    return (
      <div className="box list">
        <div className="title-2">Collections</div>
        {collections.map((collection) => (
          <CollectionView key={collection.id} collection={collection} />
        ))}
      </div>
    );
  }
);

export default function WorkspaceView({
  workspace,
  isShared,
}: {
  workspace: ServerWorkspace;
  isShared: boolean;
}) {
  const { workspaceState, addNewCollection, clearCollections } = useLiveStore(
    (state) => ({
      workspaceState: state.workspaceState,
      addNewCollection: state.addNewCollection,
      clearCollections: state.clearCollections,
    })
  );
  if (!workspaceState) return <div>No active Workspace</div>;

  async function inviteUser() {
    if (!workspaceState) return;
    console.log("invite user");
    const email = prompt("Enter email to invite");
    if (!email || !isValidEmail(email)) {
      alert("Invalid Email " + email);
      return;
    }
    // const result = await addSharedUser(workspace.id, email, "room:write");
    // if (result.data) {
    //   alert("User invited successfully");
    // } else {
    //   alert("Error," + result.message);
    // }
  }

  return (
    <div className="box list">
      <div className="title-3">Workspace({workspaceState.name})</div>
      <div className="box list">
        <div>shared Users : nitesh(offline,viewer),vicky(online,editor)</div>
      </div>
      <div className="box list-h">
        {!isShared && <button onClick={inviteUser}>Invite</button>}
        <button
          onClick={() => {
            addNewCollection("New Collection");
          }}
        >
          New Collection
        </button>
        <button
          onClick={() => {
            clearCollections();
          }}
        >
          Clear Collection
        </button>
      </div>
      <CollectionListView collections={workspaceState.collections} />
    </div>
  );
}

import { create } from "zustand";
import { createClient } from "@liveblocks/client";
import { liveblocks } from "@liveblocks/zustand";
import { immer } from "zustand/middleware/immer";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { apiCall, authSafeApiCall } from "../api/apiUtils";
import { useShallow } from "zustand/react/shallow";

import { nanoid } from "nanoid";
import { userApi } from "../api/user.api";
import { appStore } from "../store/app.store";
import { Collection, CollectionItem, FolderItem, RequestItem, Workspace } from "common-utils/types";

const client = createClient({
  authEndpoint: async (room) => {
    let profile = appStore.getState().profile;
    if (!profile) {
      const pResult = await userApi.getProfile();
      if (!pResult.data) {
        console.log(pResult);
        throw new Error("Profile not found," + pResult);
      }
      appStore.getState().setProfile(pResult.data);
      profile = pResult.data;
    }
    if (!profile) {
      throw new Error("Profile is " + profile);
    }

    const result = await authSafeApiCall<{ token: string }>({
      method: "POST",
      path: "/api/v1/liveblocks/auth",
      body: {
        roomId: room,
        userInfo: {
          name: profile.name,
          avatar: profile.picUrl,
          more: profile,
        },
      },
    });
    console.log(result);
    return result.data as any;
  },
  // publicApiKey:
  //   "pk_dev_HdV7Olm1LsySmemvLnyH3oMBuWmTbbTLwG8u3CIpsC02eX0GpP8Ym7Q0MZxhzLWB",
});

type State = {
  workspaceState?: Workspace;
  // randomNum: number;
};

type Action = {
  clearWorkspaceState: () => void;
  addNewCollection: (name: string) => void;
  addFolder: (
    collectionId: string,
    name: string,
    parentFolderId?: string
  ) => void;
  addRequest: (
    collectionId: string,
    name: string,
    parentFolderId?: string
  ) => void;
  clearCollections: () => void;
  deleteItem: (collectionId: string, itemId?: string) => void;
  updateItem: (
    collectionId: string,
    item: Partial<CollectionItem | Collection>,
    itemId?: string
  ) => void;
};

type Presence = {
  isTyping: boolean;
};

const findFolder = (collection: Collection, folderId: string) => {
  const _findFolder = (items: CollectionItem[]): FolderItem | null => {
    for (const item of items) {
      if (item.type === "folder") {
        if (item.id === folderId) {
          return item as FolderItem;
        }
        const folder = _findFolder((item as FolderItem).items);
        if (folder) {
          return folder;
        }
      }
    }
    return null;
  };
  return _findFolder(collection.items);
};

export const useLiveStore = create<WithLiveblocks<State & Action, Presence>>()(
  immer(
    liveblocks(
      (set) => ({
        clearWorkspaceState() {
          set((state) => {
            state.workspaceState = undefined;
          });
        },
        addNewCollection: (name) => {
          set((state) => {
            state.workspaceState?.collections.push({
              id: nanoid(),
              createdAt: Date.now(),
              name: name,
              description: "New Collection",
              items: [],
            });
          });
        },
        addFolder(collectionId, name, parentFolderId) {
          set((state) => {
            const collection = state.workspaceState?.collections.find(
              (collection) => collection.id === collectionId
            );
            const folderItem: FolderItem = {
              id: nanoid(),
              createdAt: Date.now(),
              type: "folder",
              name: name,
              description: "New Folder",
              items: [],
            };
            console.log("new folder is ", folderItem.id);
            if (collection && !parentFolderId) {
              collection.items.push(folderItem);
            } else if (collection && parentFolderId) {
              const folder = findFolder(collection, parentFolderId);
              console.log("adding to",folder?.name,folder?.id,folderItem)
              if (folder && folder.type === "folder") {
                folder.items.push(folderItem);
              }
            }
          });
        },
        addRequest(collectionId, name, parentFolderId) {
          set((state) => {
            const collection = state.workspaceState?.collections.find(
              (collection) => collection.id === collectionId
            );
            const requestItem: RequestItem = {
              id: nanoid(),
              createdAt: Date.now(),
              type: "request",
              name: name,
              description: "New Request",
              url: "http://localhost:3000",
              method: "GET",
              body: {
                type: "raw",
                data: "",
              },
              headers: {},
            };
            if (collection && !parentFolderId) {
              collection.items.push(requestItem);
            } else if (collection && parentFolderId) {
              const folder = findFolder(collection, parentFolderId);
              if (folder) {
                folder.items.push(requestItem);
              }
            }
          });
        },
        clearCollections() {
          set((state) => {
            if (state.workspaceState) {
              state.workspaceState.collections = [];
            }
          });
        },
        deleteItem(cid, itemId) {
          set((state) => {
            //delete collection if itemId is undefined
            if (!itemId && state.workspaceState) {
              state.workspaceState.collections =
                state.workspaceState.collections.filter(
                  (collection) => collection.id !== cid
                );
              return;
            }
            const collection = state.workspaceState?.collections.find(
              (collection) => collection.id === cid
            );
            if (collection) {
              //recursive function to delete item
              const _deleteItem = (items: CollectionItem[]) => {
                for (let i = 0; i < items.length; i++) {
                  if (items[i].id === itemId) {
                    items.splice(i, 1);
                    return;
                  }
                  if (items[i].type === "folder") {
                    _deleteItem((items[i] as FolderItem).items);
                  }
                }
              };
              _deleteItem(collection.items);
            }
          });
        },
        updateItem(collectionId, item, itemId) {
          set((state) => {
            if (!itemId && state.workspaceState) {
              state.workspaceState.collections =
                state.workspaceState.collections.map((collection) => {
                  if (collection.id === collectionId) {
                    return { ...collection, ...item };
                  }
                  return collection;
                });
              return;
            }

            if (state.workspaceState) {
              const collection = state.workspaceState.collections.find(
                (collection) => collection.id === collectionId
              );
              if (collection) {
                const _updateItem = (items: CollectionItem[]) => {
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].id === itemId) {
                      items[i] = { ...items[i], ...item };
                      return;
                    }
                    if (items[i].type === "folder") {
                      _updateItem((items[i] as FolderItem).items);
                    }
                  }
                };
                _updateItem(collection.items);
              }
            }
          });
        },
      }),
      {
        client,
        presenceMapping: {},
        storageMapping: { workspaceState: true },
      }
    )
  )
);

// export function useLiveData(selector?: (state: State) => Action & State){
//   const { workspaceState: ws, ...others } = useLiveStore();
//   return {
//     workspaceState: ws!!,
//     ...others,
//   };
// }

export function useWorkspaceState() {
  return useLiveStore((state) => state.workspaceState!);
}

// export function useShallowLiveState(selector: (state: State) => Action & State) {
//   return useLiveStore(useShallow(selector));
// }

import { create } from "zustand";
import { createClient } from "@liveblocks/client";
import { liveblocks } from "@liveblocks/zustand";
import { immer } from "zustand/middleware/immer";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { apiCall, authSafeApiCall } from "../api/apiUtils";
import { useShallow } from "zustand/react/shallow";

import { nanoid } from "nanoid";
import { userApi } from "../api/user.api";
import { useLocalStore } from "../store/app.store";
import {
  Collection,
  CollectionItem,
  Environment,
  EnvironmentVariable,
  FolderItem,
  RequestItem,
  Workspace,
} from "common-utils/types";
import { PartialWithOmit } from "common-utils";

const client = createClient({
  authEndpoint: async (room) => {
    let profile = useLocalStore.getState().profile;
    if (!profile) {
      const pResult = await userApi.getProfile();
      if (!pResult.data) {
        console.log(pResult);
        throw new Error("Profile not found," + pResult);
      }
      useLocalStore.getState().setProfile(pResult.data);
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
  duplicateItem: (collectionId: string, itemId?: string) => void;
  getItem: (
    collectionId: string,
    id?: string
  ) => CollectionItem | Collection | undefined;
  getRequest: (collectionId: string, id: string) => RequestItem | undefined;
  getItemPath: (collectionId: string, id?: string) => string;

  //env
  addEnvironment: (name: string) => void;
  getEnvById: (id: string) => Environment | undefined;
  deleteEnv: (id: string) => void;
  duplicateEnv: (id: string) => void;
  //variable
  addVariable: (envId: string, key: string, value: string) => void;
  deleteVariable: (envId: string, id: string) => void;
  updateVariable: (
    envId: string,
    id: string,
    update: PartialWithOmit<EnvironmentVariable, 'id'>
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

function findItem(collection: Collection, itemId: string) {
  let item: CollectionItem | undefined;
  let parent: FolderItem | undefined;
  const _findItem = (items: CollectionItem[], parentFolder?: FolderItem) => {
    for (const i of items) {
      if (i.id === itemId) {
        item = i;
        parent = parentFolder;
        return;
      }
      if (i.type === "folder") {
        _findItem((i as FolderItem).items, i as FolderItem);
      }
    }
  };
  _findItem(collection.items);
  return { item, parent };
}

export const useLiveStore = create<WithLiveblocks<State & Action, Presence>>()(
  immer(
    liveblocks(
      // @ts-ignore
      (set, get) => ({
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
              console.log("adding to", folder?.name, folder?.id, folderItem);
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
        duplicateItem(collectionId, itemId) {
          set((state) => {
            if (state.workspaceState) {
              const collection = state.workspaceState.collections.find(
                (collection) => collection.id === collectionId
              );
              //duplicate collection and its children
              if (collection && !itemId) {
                const cloneCollection: Collection = {
                  ...collection,
                  name: collection.name + " clone",
                  id: nanoid(),
                  createdAt: Date.now(),
                  items: [],
                };
                const _duplicateItems = (
                  items: CollectionItem[],
                  parent?: FolderItem
                ) => {
                  for (const item of items) {
                    if (item.type === "folder") {
                      const folder = item as FolderItem;
                      const cloneFolder: FolderItem = {
                        ...folder,
                        id: nanoid(),
                        items: [],
                        name: folder.name,
                      };
                      if (parent) {
                        parent.items.push(cloneFolder);
                      } else {
                        cloneCollection.items.push(cloneFolder);
                      }
                      _duplicateItems(folder.items, cloneFolder);
                    } else {
                      const request = item as RequestItem;
                      const cloneRequest: RequestItem = {
                        ...request,
                        id: nanoid(),
                        createdAt: Date.now(),
                        name: request.name,
                      };
                      if (parent) {
                        parent.items.push(cloneRequest);
                      } else {
                        cloneCollection.items.push(cloneRequest);
                      }
                    }
                  }
                };
                _duplicateItems(collection.items);
                state.workspaceState.collections.push(cloneCollection);
              } else if (collection && itemId) {
                //duplicate item
                const { item, parent } = findItem(collection, itemId);
                if (!item) {
                  return;
                }
                const _duplicateItem = (
                  items: CollectionItem[],
                  parent: FolderItem
                ) => {
                  for (const item of items) {
                    if (item.type == "folder") {
                      const folder = item as FolderItem;
                      const cloneFolder: FolderItem = {
                        ...folder,
                        id: nanoid(),
                        items: [],
                        name: folder.name,
                      };
                      parent.items.push(cloneFolder);
                      _duplicateItem(folder.items, cloneFolder);
                    } else {
                      const request = item as RequestItem;
                      const cloneRequest: RequestItem = {
                        ...request,
                        id: nanoid(),
                        createdAt: Date.now(),
                        name: request.name,
                      };
                      parent.items.push(cloneRequest);
                    }
                  }
                };
                if (item.type == "request") {
                  const request = item as RequestItem;
                  const cloneRequest: RequestItem = {
                    ...request,
                    id: nanoid(),
                    createdAt: Date.now(),
                    name: request.name + " clone",
                  };
                  if (parent) {
                    parent.items.push(cloneRequest);
                  } else {
                    collection.items.push(cloneRequest);
                  }
                } else {
                  const folder = item as FolderItem;
                  const cloneFolder: FolderItem = {
                    ...folder,
                    id: nanoid(),
                    items: [],
                    name: folder.name + "clone",
                  };
                  if (parent) {
                    parent.items.push(cloneFolder);
                  } else {
                    collection.items.push(cloneFolder);
                  }
                  _duplicateItem(folder.items, cloneFolder);
                }
              }
            }
          });
        },
        getItem(collectionId, id) {
          if (id) {
            const collection = get().workspaceState?.collections.find(
              (collection) => collection.id === collectionId
            );
            if (collection) {
              const { item } = findItem(collection, id);
              return item;
            }
          }
          return get().workspaceState?.collections.find(
            (collection) => collection.id === collectionId
          );
        },
        getRequest(collectionId, id) {
          const item = get().getItem(collectionId, id);
          if (item && (item as RequestItem).type === "request") {
            return item as RequestItem;
          }
          return undefined;
        },
        getItemPath(collectionId, id) {
          let path = "";
          const collection = get().workspaceState?.collections.find(
            (collection) => collection.id === collectionId
          );
          if (collection) {
            path += collection.name;
            const _find = (items: CollectionItem[], parentPath: string) => {
              for (const item of items) {
                if (item.id === id) {
                  path = parentPath + "/" + item.name;
                  return;
                }
                if (item.type === "folder") {
                  _find(
                    (item as FolderItem).items,
                    parentPath + "/" + item.name
                  );
                }
              }
            };
            _find(collection.items, collection.name);
          }
          return path;
        },
        addEnvironment(name) {
          set((state) => {
            state.workspaceState?.environments.push({
              id: nanoid(),
              name: name,
              variables: [],
              createdAt: Date.now(),
            });
          });
        },
        getEnvById(id) {
          if (id == get().workspaceState?.globalEnvironment.id) {
            return get().workspaceState?.globalEnvironment;
          }
          return get().workspaceState?.environments.find(
            (env) => env.id === id
          );
        },
        deleteEnv(id) {
          set((state) => {
            if (state.workspaceState) {
              state.workspaceState.environments = state.workspaceState?.environments.filter(
                (env) => env.id !== id
              );
            }
          });
        },
        duplicateEnv(id) {
          set((state) => {
            if (state.workspaceState) {
              const env = state.workspaceState.environments.find(
                (env) => env.id === id
              );
              if (env) {
                state.workspaceState.environments.push({
                  ...env,
                  id: nanoid(),
                  name: env.name + " clone",
                  createdAt: Date.now(),
                });
              }
            }
          });
        },
        //variables
        addVariable(envId, key, value) {
          set((state) => {
            const env = state.workspaceState?.environments.find(
              (env) => env.id === envId
            );
            if (env) {
              env.variables.push({ id: nanoid(), key, value });
            }
          });
        },
        deleteVariable(envId, id) {
          set((state) => {
            const env = state.workspaceState?.environments.find(
              (env) => env.id === envId
            );
            if (env) {
              env.variables = env.variables.filter((v) => v.id !== id);
            }
          });
        },
        updateVariable(envId, id, { ...update }) {
          set((state) => {
            const env = state.workspaceState?.environments.find(
              (env) => env.id === envId
            );
            if (env) {
              env.variables = env.variables.map((v) => {
                if (v.id === id) {
                  return { ...v, ...update };
                }
                return v;
              });
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

// export function useRequest(collectionId: string, id: string) {
//   return useLiveStore(
//     useShallow((state) => {
//       const item = state.getItem(collectionId, id);
//       if (item && (item as RequestItem).type === "request") {
//         return item as RequestItem;
//       }
//       return undefined;
//     })
//   );
// }

// export function useShallowLiveState(selector: (state: State) => Action & State) {
//   return useLiveStore(useShallow(selector));
// }

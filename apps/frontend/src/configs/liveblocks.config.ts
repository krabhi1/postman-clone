import { createClient } from "@liveblocks/client";
import { authSafeApiCall } from "../api/apiUtils";

import { userApi } from "../api/user.api";
import { appStore } from "../store/app.store";
import {
  Collection,
  CollectionItem,
  FolderItem,
  Workspace,
} from "common-utils/types";
import { init, useLiveStore } from "common-store";

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

init(client);
export function useWorkspaceState() {
  return useLiveStore((state) => state.workspaceState!);
}

export { useLiveStore };

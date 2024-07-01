import { StoreApi, UseBoundStore, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getWorkspaces } from "../api/workspace.api";
import { userApi } from "../api/user.api";
import { ServerWorkspace, User, WorkspaceGroup } from "common-utils/types";
import { KeyValue } from "common-utils";
import { useShallow } from "zustand/react/shallow";
import { WithImmer } from "../others/types";
export type FolderLocal = {
  isOpen: boolean;
  some?: string;
};
export type CollectionLocal = {
  isOpen: boolean;
  some: string;
};
export type Local = FolderLocal | CollectionLocal;
export type LocalState = {
  // isAuth: boolean;
  profile?: User;
  workspaceGroup?: WorkspaceGroup;
  local: KeyValue<Local>;
};

export type LocalAction = {
  // setAuth: (isAuth: boolean) => void;
  setProfile: (profile?: User) => void;
  setWorkspaces: (workspace: WorkspaceGroup) => void;
  addWorkspace: (workspace: ServerWorkspace) => void;
  deleteWorkspace: (workspaceId: string) => void;
  fetchWorkspaces: () => Promise<void>;
  updateLocal: (key: string, value: Partial<Local>) => void;
};

export const localStore:UseBoundStore<WithImmer<StoreApi<LocalState & LocalAction>>> = create<LocalState & LocalAction>()(
  immer((set) => ({
    workspaceGroup: undefined,
    local: {},
    setProfile: (profile?: User) => {
      set((state) => {
        state.profile = profile;
      });
    },
    setWorkspaces: (workspaces: WorkspaceGroup) => {
      set((state) => {
        state.workspaceGroup = workspaces;
      });
    },
    addWorkspace: (workspace: ServerWorkspace) => {
      set((state) => {
        state.workspaceGroup?.self.push(workspace);
      });
    },
    deleteWorkspace: (workspaceId: string) => {
      set((state) => {
        if (state.workspaceGroup) {
          state.workspaceGroup.self = state.workspaceGroup.self.filter(
            (w) => w.id !== workspaceId
          );
        }
      });
    },
    fetchWorkspaces: async () => {
      if (localStore.getState().workspaceGroup) return;
      safeFetch(async () => {
        const workspaceGroupResult = await getWorkspaces();
        set((state) => {
          if (workspaceGroupResult.data) {
            state.workspaceGroup = workspaceGroupResult.data;
          }
        });
      });
    },
    updateLocal: (key: string, value: Partial<Local>) => {
      set((state) => {
        state.local[key] = { ...state.local[key], ...value };
      });
    },
  }))
);
export type LocalType = "folder" | "collection";

export function useLocalState<T extends Local>(key: string, type: LocalType) {
  //if no state then create one
  if (!localStore.getState().local[key]) {
    if (type === "folder") {
      localStore
        .getState()
        .updateLocal(key, { isOpen: true } as FolderLocal);
    } else if (type === "collection") {
      localStore
        .getState()
        .updateLocal(key, { isOpen: true } as CollectionLocal);
    }
  }
  return localStore(useShallow((state) => state.local[key])) as T;
}

async function safeFetch(callback: () => void) {
  if (!localStore.getState().profile) {
    const profileResult = await userApi.getProfile();
    if (profileResult.data) {
      localStore.getState().setProfile(profileResult.data);
      callback();
    }
  } else {
    callback();
  }
}

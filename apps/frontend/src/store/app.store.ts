import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getWorkspaces } from "../api/workspace.api";
import { userApi } from "../api/user.api";
import { ServerWorkspace, User, WorkspaceGroup } from "common-utils/types";
import { KeyValue } from "common-utils";
import { useShallow } from "zustand/react/shallow";
export type FolderLocalState = {
  isOpen: boolean;
  some?: string;
};
export type CollectionLocalState = {
  isOpen: boolean;
  some: string;
};
export type LocalState = FolderLocalState | CollectionLocalState;
export type AppState = {
  // isAuth: boolean;
  profile?: User;
  workspaceGroup?: WorkspaceGroup;
  local: KeyValue<LocalState>;
};

export type AppAction = {
  // setAuth: (isAuth: boolean) => void;
  setProfile: (profile?: User) => void;
  setWorkspaces: (workspace: WorkspaceGroup) => void;
  addWorkspace: (workspace: ServerWorkspace) => void;
  deleteWorkspace: (workspaceId: string) => void;
  fetchWorkspaces: () => Promise<void>;
  updateLocal: (key: string, value: Partial<LocalState>) => void;
};

export const appStore = create<AppState & AppAction>()(
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
      if (appStore.getState().workspaceGroup) return;
      safeFetch(async () => {
        const workspaceGroupResult = await getWorkspaces();
        set((state) => {
          if (workspaceGroupResult.data) {
            state.workspaceGroup = workspaceGroupResult.data;
          }
        });
      });
    },
    updateLocal: (key: string, value: Partial<LocalState>) => {
      set((state) => {
        state.local[key] = { ...state.local[key], ...value };
      });
    },
  }))
);
export type LocalType = "folder" | "collection";

export function useLocalState<T extends LocalState>(key: string, type: LocalType) {
  //if no state then create one
  if (!appStore.getState().local[key]) {
    if (type === "folder") {
      appStore
        .getState()
        .updateLocal(key, { isOpen: true } as FolderLocalState);
    } else if (type === "collection") {
      appStore
        .getState()
        .updateLocal(key, { isOpen: true } as CollectionLocalState);
    }
  }
  return appStore(useShallow((state) => state.local[key])) as T;
}

async function safeFetch(callback: () => void) {
  if (!appStore.getState().profile) {
    const profileResult = await userApi.getProfile();
    if (profileResult.data) {
      appStore.getState().setProfile(profileResult.data);
      callback();
    }
  } else {
    callback();
  }
}

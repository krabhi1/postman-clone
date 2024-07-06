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
export type EditorMainTab = {
  id: string;
  name: string;
  type:
    | "POST"
    | "GET"
    | "PUT"
    | "DELETE"
    | "ENV"
    | "GLOBAL_ENV"
    | "FOLDER"
    | "COLLECTION";
};
export type LocalState = {
  // isAuth: boolean;
  profile?: User;
  workspaceGroup?: WorkspaceGroup;
  local: KeyValue<Local>;
  //editor open tabs state
  editorTabs: EditorMainTab[];
  editorActiveTabId?: string;
};

export type LocalAction = {
  // setAuth: (isAuth: boolean) => void;
  setProfile: (profile?: User) => void;
  setWorkspaces: (workspace: WorkspaceGroup) => void;
  addWorkspace: (workspace: ServerWorkspace) => void;
  deleteWorkspace: (workspaceId: string) => void;
  fetchWorkspaces: () => Promise<void>;
  updateLocal: (key: string, value: Partial<Local>) => void;
  getLocal: <T extends Local>(key: string) => T;
  //editor actions
  addEditorTab: (tab: EditorMainTab) => void;
  removeEditorTab: (tabId: string) => void;
  setActiveEditorTab: (tabId: string) => void;
  addEditorTabAndSetAsActive: (tab: EditorMainTab) => void;
};
function isEditorTabExists(tabId: string) {
  return useLocalStore.getState().editorTabs.some((t) => t.id === tabId);
}
export const useLocalStore: UseBoundStore<
  WithImmer<StoreApi<LocalState & LocalAction>>
> = create<LocalState & LocalAction>()(
  immer((set) => ({
    workspaceGroup: undefined,
    editorTabs: [],
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
      if (useLocalStore.getState().workspaceGroup) return;
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
    getLocal: <T extends Local>(key: string) => {
      if (!useLocalStore.getState().local[key]) {
        useLocalStore.getState().updateLocal(key, { isOpen: true } as T);
      }
      return useLocalStore.getState().local[key] as T;
    },
    addEditorTab: (tab: EditorMainTab) => {
      set((state) => {
        if (isEditorTabExists(tab.id)) {
          return;
        }
        state.editorTabs.push(tab);
      });
    },
    removeEditorTab: (tabId: string) => {
      set((state) => {
        state.editorTabs = state.editorTabs.filter((t) => t.id !== tabId);
      });
    },
    setActiveEditorTab: (tabId: string) => {
      set((state) => {
        if (isEditorTabExists(tabId)) {
          state.editorActiveTabId = tabId;
          return;
        }
      });
    },
    addEditorTabAndSetAsActive: (tab: EditorMainTab) => {
      set((state) => {
        if (isEditorTabExists(tab.id)) {
          state.editorActiveTabId = tab.id;
          return;
        }
        state.editorTabs.push(tab);
        state.editorActiveTabId = tab.id;
      });
    },
  }))
);
export type LocalType = "folder" | "collection";

export function useLocalState<T extends Local>(key: string, type: LocalType) {
  //if no state then create one
  if (!useLocalStore.getState().local[key]) {
    if (type === "folder") {
      useLocalStore
        .getState()
        .updateLocal(key, { isOpen: true } as FolderLocal);
    } else if (type === "collection") {
      useLocalStore
        .getState()
        .updateLocal(key, { isOpen: true } as CollectionLocal);
    }
  }
  return useLocalStore(useShallow((state) => state.local[key])) as T;
}

async function safeFetch(callback: () => void) {
  if (!useLocalStore.getState().profile) {
    const profileResult = await userApi.getProfile();
    if (profileResult.data) {
      useLocalStore.getState().setProfile(profileResult.data);
      callback();
    }
  } else {
    callback();
  }
}

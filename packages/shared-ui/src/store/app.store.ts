import { StoreApi, UseBoundStore, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getWorkspaces } from "../api/workspace.api";
import { userApi } from "../api/user.api";
import { ServerWorkspace, User, WorkspaceGroup } from "common-utils/types";
import { KeyValue } from "common-utils";
import { useShallow } from "zustand/react/shallow";
import { WithImmer } from "../others/types";

export type EditorTabItemState = {
  id: string;
  name: string;
  type: "REQUEST" | "ENV" | "GLOBAL_ENV" | "FOLDER" | "COLLECTION";
  // subType?: string | "POST" | "GET" | "PUT" | "DELETE";
  data?: any;
};
export type LocalState = {
  // isAuth: boolean;
  profile?: User;
  workspaceGroup?: WorkspaceGroup;
  // local: KeyValue<ItemLocal>; //generally for collection and items state
  //editor open tabs state
  editorTabs: EditorTabItemState[];
  editorActiveTabId?: string;

  //some local key value state
  local: KeyValue<any>;



};

export type LocalAction = {
  // setAuth: (isAuth: boolean) => void;
  setProfile: (profile?: User) => void;
  setWorkspaces: (workspace: WorkspaceGroup) => void;
  addWorkspace: (workspace: ServerWorkspace) => void;
  deleteWorkspace: (workspaceId: string) => void;
  fetchWorkspaces: () => Promise<void>;
  // updateItemLocal: (key: string, value: Partial<ItemLocal>) => void;
  // getItemLocal: <T extends ItemLocal>(key: string) => T | undefined;
  //editor actions
  addEditorTab: (tab: EditorTabItemState) => void;
  removeEditorTab: (tabId: string) => void;
  setActiveEditorTab: (tabId: string) => void;
  addEditorTabAndSetAsActive: (tab: EditorTabItemState) => void;

  getLocal: <T=any>(key: string) => T | undefined;
  setLocal: (key: string, value: any) => void;
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
    addEditorTab: (tab: EditorTabItemState) => {
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
    addEditorTabAndSetAsActive: (tab: EditorTabItemState) => {
      set((state) => {
        if (isEditorTabExists(tab.id)) {
          state.editorActiveTabId = tab.id;
          return;
        }
        state.editorTabs.push(tab);
        state.editorActiveTabId = tab.id;
      });
    },

    getLocal: <T>(key: string) => {
      return useLocalStore.getState().local[key] as T;
    },
    setLocal: (key: string, value: any) => {
      set((state) => {
        state.local[key] = value;
      });
    },
  }))
);
//@ts-ignore
window._useLocalStore = useLocalStore;
// export type ItemLocalType = "folder" | "collection";

// export function useItemLocalState<T extends ItemLocal>(key: string, type: ItemLocalType) {
//   //if no state then create one
//   if (!useLocalStore.getState().local[key]) {
//     if (type === "folder") {
//       useLocalStore
//         .getState()
//         .updateItemLocal(key, { isOpen: true } as FolderLocal);
//     } else if (type === "collection") {
//       useLocalStore
//         .getState()
//         .updateItemLocal(key, { isOpen: true } as CollectionLocal);
//     }
//   }
//   return useLocalStore(useShallow((state) => state.local[key])) as T;
// }


export function useLocalState<T>(key: string, defaultVal?: T) {
  let isNew = false
  if (useLocalStore.getState().local[key] == undefined || useLocalStore.getState().local[key] == null) {
    useLocalStore.getState().setLocal(key, defaultVal);
    isNew = true
  }
  return useLocalStore(useShallow((state) => [state.local[key] as T, (value: T) => state.setLocal(key, value), isNew] as [T, (value: T) => void, boolean]));

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

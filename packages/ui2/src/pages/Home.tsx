import { clearAuthToken, sleep } from "common-utils";
import { ServerWorkspace } from "common-utils/types";
import { memo, useEffect, useCallback } from "react";
import { userApi } from "../api/user.api";
import { getWorkspaces, createWorkspace, deleteWorkspace } from "../api/workspace.api";
import ProfileView from "../components/ProfileView";
import { router } from "../others/pageRouter";
import { localStore } from "../store/app.store";

const WorkspaceItemView = memo(
    ({
      workspace,
      onOpen,
      onDelete,
      isShared,
    }: {
      workspace: ServerWorkspace;
      onOpen?: (id: string) => void;
      onDelete?: (id: string) => void;
      isShared: boolean;
    }) => {
      return (
        <div className="list box">
          <div>{workspace.name}</div>
          <div>{workspace.description}</div>
          <div>{workspace.createdAt.toString()}</div>
          <div className="box list-h">
            <button
              onClick={() => {
                onOpen?.(workspace.id);
              }}
            >
              Open
            </button>
            <button
              onClick={() => {
                onDelete?.(workspace.id);
              }}
            >
              delete
            </button>
          </div>
        </div>
      );
    }
  );
  

export default function Home() {
    // const [workspaces, setWorkspaces] = useImmer<Workspace[]>([]);
    const profile = localStore((state) => state.profile);
    const workspaceGroup = localStore((state) => state.workspaceGroup);
    async function init() {
      const userResult = await userApi.getProfile();
      if (userResult.data) {
        localStore.getState().setProfile(userResult.data);
      }
      console.log(userResult);
  
      //fetch workspaces
      const workspacesResult = await getWorkspaces();
      if (workspacesResult.data) {
        localStore.getState().setWorkspaces(workspacesResult.data);
      }
      console.log(workspacesResult);
    }
    useEffect(() => {
      init();
    }, []);
  
    async function logOut() {
      localStore.getState().setProfile(undefined);
      clearAuthToken();
      await sleep(1000);
      router.navigate("/login", { replace: true });
    }
    async function handleCreateWorkspace() {
      const result = await createWorkspace({
        name: "New Workspace",
        description: "New Workspace Description",
      });
      if (result.data) {
        localStore.getState().addWorkspace(result.data);
      }
    }
    const handleOpen = useCallback(
      (id: string) => {
        router.navigate(`/workspace/${id}`);
      },
      [workspaceGroup]
    );
  
    //delete workspace
    const handleDeleteWorkspace = useCallback(async (id: string) => {
      localStore.getState().deleteWorkspace(id);
      const result = await deleteWorkspace(id);
      console.log(result);
    }, []);
    return (
      <div className="list">
        <h1>Home</h1>
        <div>
          <button onClick={logOut}>Log out</button>
        </div>
        <ProfileView profile={profile} />
        <div className="box list-h">
          <button onClick={handleCreateWorkspace}>New Workspace</button>
        </div>
        {/* workspaces list */}
        <div className="box list">
          <div className="title-2">Workspaces</div>
          {workspaceGroup?.self.map((workspace) => (
            <WorkspaceItemView
              key={workspace.id}
              workspace={workspace}
              onOpen={handleOpen}
              onDelete={handleDeleteWorkspace}
              isShared={false}
            />
          ))}
        </div>
        <div className="box list">
          <div className="title-2 text-blue">Shared Workspaces</div>
          {workspaceGroup?.shared.map((workspace) => (
            <WorkspaceItemView
              key={workspace.id}
              workspace={workspace}
              onOpen={handleOpen}
              onDelete={handleDeleteWorkspace}
              isShared={true}
            />
          ))}
        </div>
      </div>
    );
  }
  
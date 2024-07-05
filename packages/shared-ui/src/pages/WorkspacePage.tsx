import { sleep } from "common-utils";
import { ServerWorkspace } from "common-utils/types";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import WorkspaceView from "../components/WorkspaceView";
import { useLiveStore } from "../configs/liveblocks.config";
import { router } from "../others/pageRouter";
import { useLocalStore } from "../store/app.store";
import WorkspaceEditor from "../components/workspace/WorkspaceEditor";

function Load({
    workspace, 
    isShared,
  }: {
    workspace: ServerWorkspace;
    isShared: boolean;
  }) {

    const {
      workspaceState,
      clearWorkspaceState,
      liveblocks: { enterRoom, leaveRoom, isStorageLoading, room, status },
    } = useLiveStore();

    const { roomId } = workspace;

    useEffect(() => {
      enterRoom(roomId);
  
      return () => {
        leaveRoom();
        clearWorkspaceState();
      };
    }, [enterRoom, leaveRoom]);

  
    useEffect(() => {
      const errorUnSub = room?.subscribe("error", async (e) => {
        console.log("room error", e);
        alert(e.message);
        await sleep(1000);
        router.navigate("/home", { replace: true });
      });
  
      const statusUnSub = room?.subscribe("status", (e) => {
        console.log("status", e);
      });
      return () => {
        errorUnSub?.();
        statusUnSub?.();
      };
    }, [room]);
  
    if (isStorageLoading) {
      return <div>Loading...</div>;
    }
    if (!workspaceState && !isStorageLoading) {
      return <div>No workspace</div>;
    }
    return (
      <>
      {/* <WorkspaceView workspace={workspace} isShared={isShared} /> */}
      <WorkspaceEditor/>
      </>
    );
  }
  
  export default function WorkspacePage() {
    const { id } = useParams();
  
    const workspaceGroup = useLocalStore((state) => state.workspaceGroup);
    const profile = useLocalStore((state) => state.profile);
    const workspace = [
      ...(workspaceGroup?.self || []),
      ...(workspaceGroup?.shared || []),
    ].find((w) => w.id === id);
  
    const isShared =
      (workspaceGroup?.shared || []).findIndex((w) => w.id === id) == -1
        ? false
        : true;
  
    console.log("isShared", isShared);
  
    useEffect(() => {
      useLocalStore.getState().fetchWorkspaces();
    }, []);

  
    if (!workspaceGroup) {
      return <div>loading...</div>;
    }
  
    if (!workspace) {
      return <div>Workspace not found</div>;
    }

    return <Load workspace={workspace} isShared={isShared} />;
  }
  
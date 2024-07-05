import { PartialWithMust } from "common-utils";
import { ServerWorkspace, WorkspaceGroup } from "common-utils/types";
import { useLocalStore } from "../store/app.store";
import { authSafeApiCall } from "./apiUtils";

export async function createWorkspace(
  workspace: PartialWithMust<ServerWorkspace, "name" | "description">
) {
  const result = await authSafeApiCall<ServerWorkspace>({
    path: "/api/v1/workspace",
    method: "POST",
    body: workspace,
  });
  return result;
}

// get workspaces of user
export async function getWorkspaces() {
  const profile = useLocalStore.getState().profile;
  const result = await authSafeApiCall<WorkspaceGroup>({
    path: "/api/v1/workspace",
    query: {
      userId: profile?.id,
    },
    method: "GET",
  });
  return result;
}

//delete workspace
export async function deleteWorkspace(workspaceId: string) {
  const result = await authSafeApiCall<ServerWorkspace>({
    path: `/api/v1/workspace/${workspaceId}`,
    method: "DELETE",
  });
  return result;
}

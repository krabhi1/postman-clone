import { RoomPermission, ServerWorkspace } from "../others/types";
import { authSafeApiCall } from "./apiUtils";

export async function addSharedUser(
  workspaceId: string,
  email: string,
  permission: RoomPermission
) {
  return authSafeApiCall<ServerWorkspace>({
    method: "POST",
    path: `/api/v1/workspace/${workspaceId}/sharedUsers`,
    body: { email, permission },
  });
}

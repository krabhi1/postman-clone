import { liveblocks } from "../configs/liveblocks.config.js";
import { isHttpOk } from "../others/apicall.utils.js";
import { makeErrorResult, makeResult } from "../others/utils.js";

export async function identifyUser({
  userId,
  groupIds,
  userInfo,
}: {
  userId: string;
  groupIds: string[];
  userInfo: {
    name: string;
    avatar?: string;
    more?: any;
  };
}) {
  const result = makeErrorResult<{ token: string }>();
  try {
    const { body, status } = await liveblocks.identifyUser(
      { userId, groupIds },
      { userInfo }
    );

    if (!isHttpOk(status)) {
      result.message = "Error identifying user";
      result.error = body;
      result.code = status;
      console.log("identifyUser error", body, status);
    } else {
      result.data = JSON.parse(body);
      result.code = status;
    }
  } catch (error: any) {
    result.error = error;
    result.message = "Error identifying user";
  }
  return result;
}

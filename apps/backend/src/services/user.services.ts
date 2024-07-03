import { createUser, getUsers } from "../database/user.db.js";
import {
  generateUserSignInToken,
  refreshUserSignInToken,
  verifyUserSignInToken,
} from "../jwt/user.jwt.js";
import { getGoogleTokens, getUserProfile } from "../others/google.utils.js";
import {
  ResultCode,
  makeResultFrom,
  makeResult,
  makeErrorResult,
} from "../others/utils.js";
import { GetUser } from "../types/user.types.js";

export async function handleGoogleSignInFromCode(code: string) {
  let result = makeErrorResult<{ token: string }>();
  const tokensResult = await getGoogleTokens(code);
  if (!tokensResult.data) {
    return makeResultFrom({
      other: tokensResult,
      result,
    });
  }

  const profileResult = await getUserProfile(tokensResult.data.access_token);
  if (!profileResult.data) {
    return makeResultFrom({
      other: profileResult,
      result,
    });
  }

  //check user is new else create
  const gResult = await getUsers({ email: profileResult.data.email });
  if (!gResult.data || gResult.data.length == 0) {
    if (!tokensResult.data.refresh_token) {
      return makeResultFrom({
        code: ResultCode.GOOGLE_MISSING_REFRESH_TOKEN,
        result,
      });
    }
    const cResult = await createUser({
      email: profileResult.data.email,
      name: profileResult.data.name,
      picUrl: profileResult.data.picture,
      googleRefreshToken: tokensResult.data.refresh_token!!,
    });
    if (!cResult.data) {
      return makeResultFrom({
        other: cResult,
        result,
      });
    }
  } else {
    //getting new token
    const token = generateUserSignInToken({ userId: gResult.data[0].id });
    result = {
      code: ResultCode.OK,
      data: {
        token: token,
      },
    };
  }
  return result;
}

export async function handleRefreshAccessToken(oldToken: string) {
  return refreshUserSignInToken(oldToken);
}

export async function handleGetUser(userId: string) {
  const result = makeResult<GetUser>();
  const gResult = await getUsers({ id: userId });
  if (!gResult.data || gResult.data.length == 0) {
    return makeResultFrom({
      other: gResult,
      result,
    });
  }
  result.code = ResultCode.OK;
  const user = gResult.data[0];
  result.data = {
    id: user.id,
    email: user.email,
    name: user.name,
    picUrl: user.picUrl,
    createdAt: user.createdAt,
  };
  return result;
}

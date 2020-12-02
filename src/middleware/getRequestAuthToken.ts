import { Request } from 'express';
import SysEnv from '../modules/SysEnv';

export function getRequestAuthToken(request: Request): string | undefined {
  let authToken: string | undefined;
  if (SysEnv.CookieAuth()) {
    const cookies = request.cookies;
    if (cookies && cookies.Authorization) {
      authToken = cookies.Authorization;
    }
  } else {
    if (request.headers.authorization) {
      authToken = request.headers.authorization.replace('Bearer ', '');
    }
  }
  return authToken;
}

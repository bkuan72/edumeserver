/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/DataStoredInToken';
import UserModel from '../server/models/user.model';
import InvalidAuthenticationTokenException from '../exceptions/InvalidAuthenticationTokenException';
import { TokenModel } from '../server/models/token.model';
import SysLog from '../modules/SysLog';
import SysEnv from '../modules/SysEnv';
import InvalidUserStatusException from '../exceptions/InvalidUserStatusException';
import { blacklist_tokens_schema_table } from '../schemas/tokens.schema';
import ExpiredTokenException from '../exceptions/ExpiredTokenExceptions';
import NonAdminUserException from '../exceptions/NonAdminUserException';
import { getRequestAuthToken } from './getRequestAuthToken';

async function adminAuthMiddleware(request: Request, _response: Response, next: NextFunction) {
    const users = new UserModel();
    const blacklistTokens = new TokenModel(blacklist_tokens_schema_table);
    const authToken = getRequestAuthToken(request);

  if (authToken) {
    try {
      jwt.verify(authToken, SysEnv.JWT_SECRET, async (err: any, verificationResponse: any) => {
        if (err) {
            next(new InvalidAuthenticationTokenException(err));
        } else {
            verificationResponse as DataStoredInToken;
            const id = verificationResponse.user_id;
            const user = await users.findById(id);
            if (user) {
              if (user.status === 'ENABLED') {
                if (blacklistTokens.tokenExpired(verificationResponse.expiryInSec,
                                                 verificationResponse.createTimeStamp)) {
                  SysLog.error('Expired Token Used By User Id :', id);
                  next(new ExpiredTokenException(user));
                } else {
                  const deadToken = await blacklistTokens.find({ token: authToken})
                  if (
                    deadToken != undefined && deadToken.length > 0
                 ) {
                    SysLog.error('Blacklisted Token Used by User Id :', id);
                      next(new WrongAuthenticationTokenException());
                  } else {
                    if (verificationResponse.adminUser) {
                      next();
                    } else {
                      SysLog.error('Authentication Failed For Non Admin User Id :', id);
                      next(new NonAdminUserException(user));
                    }
                  }
                }
              } else {
                SysLog.error('Authentication Token used by Invalid User Id :', id);
                next(new InvalidUserStatusException(user));
              }
            } else {
              SysLog.error('Authentication Token used by Invalid User Id :', id);
              next(new WrongAuthenticationTokenException());
            }
        }
      });
    } catch (error) {
      SysLog.error('Wrong Authentication Token :', error)
      next(new WrongAuthenticationTokenException());
    }
  } else {
    SysLog.error('Missing Authorization: ', request)
    next(new AuthenticationTokenMissingException());
  }
}

export default adminAuthMiddleware;
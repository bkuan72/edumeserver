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

async function authMiddleware(request: Request, _response: Response, next: NextFunction) {
  const cookies = request.cookies;
  const users = new UserModel();
  const blacklistTokens = new TokenModel(blacklist_tokens_schema_table);
  if (cookies && cookies.Authorization) {
    try {
      jwt.verify(cookies.Authorization, SysEnv.JWT_SECRET, async (err: any, verificationResponse: any) => {
        if (err) {
            next(new InvalidAuthenticationTokenException(err));
        } else {
            verificationResponse as DataStoredInToken;
            const id = verificationResponse.user_id;
            const user = await users.findById(id);
            if (user) {
              if (user.data.status === 'ENABLED') {
                if (blacklistTokens.tokenExpired(verificationResponse.expireInMin,
                                                 verificationResponse.createTimeStamp)) {
                  SysLog.error('Expired Token Used By User Id :', id);
                  next(new ExpiredTokenException(user));
                } else {
                  if (
                    await blacklistTokens.find({ token: cookies.Authorization})
                 ) {
                    SysLog.error('Blacklisted Token Used by User Id :', id);
                      next(new WrongAuthenticationTokenException());
                  } else {
                    next();
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

export default authMiddleware;
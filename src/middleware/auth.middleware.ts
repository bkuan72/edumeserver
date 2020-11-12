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

async function authMiddleware(request: Request, _response: Response, next: NextFunction) {
  const cookies = request.cookies;
  const users = new UserModel();
  const blacklistTokens = new TokenModel('blacklistTokens');
  if (cookies && cookies.Authorization) {

    try {
      jwt.verify(cookies.Authorization, SysEnv.JWT_SECRET, async (err: any, verificationResponse: any) => {
        if (err) {
            next(new InvalidAuthenticationTokenException(err));
        } else {
            verificationResponse as DataStoredInToken;
            const id = verificationResponse.user_id;
            if (
                await blacklistTokens.find({ token: cookies.Authorization})
             ) {
              SysLog.error('Wrong Authentication Token. Missing User Id :', id);
                next(new WrongAuthenticationTokenException());
            } else {
                    const user = await users.findById(id);
                if (user) {
                  next();
                } else {
                  SysLog.error('Wrong Authentication Token. Missing User Id :', id);
                  next(new WrongAuthenticationTokenException());
                }
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
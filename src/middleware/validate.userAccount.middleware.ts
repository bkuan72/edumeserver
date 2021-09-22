/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import UserModel from '../server/models/user.model';
import { AccountModel } from '../server/models/account.model';
import SysLog from '../modules/SysLog';
import CommonFn from '../modules/CommonFnModule';
 
function validationUserAccountMiddleware<T>(): express.RequestHandler {
  return (req, res, next) => {

    const user = new UserModel();
    const account = new AccountModel();

    user.findById(req.body.user_id).then ((userDTO) => {
        if (CommonFn.isUndefined(userDTO)) {
            SysLog.error('Invalid User Id :', req.body)
            next(new HttpException(400, "Invalid User Id"));
        } else {
            account.findById(req.body.account_id).then ((accountDTO) => {
                if (CommonFn.isUndefined(accountDTO)) {
                    SysLog.error('Invalid Account Id', req.body);
                    next(new HttpException(400, "Invalid Account Id"));
                } else {
                    next();
                }
            })
            .catch((err) => {
              throw(err);
            });
        }
    })
    .catch((err) => {
      throw(err);
    });
  }
}

export default validationUserAccountMiddleware;
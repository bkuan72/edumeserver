/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import { isUndefined } from '../modules/isUndefined';
import UserModel from '../server/models/user.model';
import { AccountModel } from '../server/models/account.model';
import SysLog from '../modules/SysLog';
 
function validationUserAccountMiddleware<T>(): express.RequestHandler {
  return (req, res, next) => {

    const user = new UserModel();
    const account = new AccountModel();

    user.findById(req.body.user_id).then ((userDTO) => {
        if (isUndefined(userDTO)) {
            SysLog.error('Invalid User Id :', req.body)
            next(new HttpException(400, "Invalid User Id"));
        } else {
            account.findById(req.body.account_id).then ((accountDTO) => {
                if (isUndefined(accountDTO)) {
                    SysLog.error('Invalid Account Id', req.body);
                    next(new HttpException(400, "Invalid Account Id"));
                } else {
                    next();
                }
            })
        }
    })
  }
}

export default validationUserAccountMiddleware;
import { AccountModel } from './../server/models/account.model';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import UserModel from '../server/models/user.model';
import { GroupModel } from '../server/models/group.model';
import SysLog from '../modules/SysLog';
import CommonFn from '../modules/CommonFnModule';
 
function validationUserGroupMiddleware<T>(): express.RequestHandler {
  return (req, res, next) => {

    const user = new UserModel();
    const group = new GroupModel();
    const account = new AccountModel();

    user.findById(req.body.user_id).then ((userDTO) => {
        if (CommonFn.isUndefined(userDTO)) {
            SysLog.error('Invalid User Id :', req.body)
            next(new HttpException(400, "Invalid User Id"));
        } else {
            if (CommonFn.isEmpty(req.body.account_id)) {
                checkGroupId(group, req, next);
            } else {
                account.findById(req.body.account_id).then((accountDTO) => {
                    if (CommonFn.isUndefined(accountDTO)) {
                        SysLog.error('Invalid Account Id :', req.body)
                        next(new HttpException(400, "Invalid Account Id"));
                    } else {
                        checkGroupId(group, req, next);
                    }
                })
            }

        }
    })
  }

    function checkGroupId(group: GroupModel, req: any, next: any) {
        group.findById(req.body.group_id).then((groupDTO) => {
            if (CommonFn.isUndefined(groupDTO)) {
                SysLog.error('Invalid Group Id', req.body);
                next(new HttpException(400, "Invalid Group Id"));
            } else {
                next();
            }
        });
    }
}

export default validationUserGroupMiddleware;
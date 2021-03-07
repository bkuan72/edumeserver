/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AccountGroupMemberModel} from "../models/accountGroupMember.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import { accountGroupMembers_schema } from "../../schemas/accountGroupMembers.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import { AccountGroupMemberDTO, AccountGroupMemberListDTO, UpdAccountGroupMemberDTO } from "../../dtos/accountGroupMembers.DTO";
import NoDataException from "../../exceptions/NoDataExceptions";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";

export class AccountGroupMembersController implements Controller{
  public path='/accountGroupMembers';
  public router= express.Router();
  private accountGroupMembers = new AccountGroupMemberModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }



  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(accountGroupMembers_schema),
                    this.newAccountGroupMember);
    this.router.get(this.path+'/accountMemberList/byAccountId/:accountId', authMiddleware, this.getAccountMemberListByAccountId);
    this.router.get(this.path+'/groupMemberList/byGroupId/:groupId', authMiddleware, this.getGroupMemberListByGroupId);
    this.router.get(this.path+'/byAccountGroupMemberId/:accountGroupMemberId', authMiddleware, this.findById);
    this.router.patch(this.path+'/:accountGroupMemberId', authMiddleware, validationUpdateMiddleware(accountGroupMembers_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/memberListDTO', adminAuthMiddleware, this.apiMemberListDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AccountGroupMemberDTO();
    response.send(dto);
  }
  apiMemberListDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AccountGroupMemberListDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAccountGroupMemberDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(accountGroupMembers_schema);
  }

  newAccountGroupMember  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.accountGroupMembers.create(request.body).then((respAccountGroupMemberDTO) => {
        if (respAccountGroupMemberDTO) {
            response.send(respAccountGroupMemberDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.findById(request.params.accountGroupMemberId).then((respAccountGroupMemberDTO) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.updateById(request.params.accountGroupMemberId, request.body).then((respAccountGroupMemberDTO) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
  }

  getAccountMemberListByAccountId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.getAccountMemberList(request.params.accountId).then((respAccountGroupMemberDTO: AccountGroupMemberDTO[]) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new NoDataException())
      }
    })
  }
  getGroupMemberListByGroupId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.getAccountMemberList(request.params.groupId).then((respAccountGroupMemberDTO: AccountGroupMemberDTO[]) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new NoDataException())
      }
    })
  }
}
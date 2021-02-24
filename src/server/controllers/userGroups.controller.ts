import { UserGroupData } from './../../schemas/userGroups.schema';
import { CommonFn } from '../../modules/CommonFnModule';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { userGroups_schema } from "../../schemas/userGroups.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import { UpdUserGroupsDTO, UserGroupsDTO } from "../../dtos/userGroups.DTO";

import UserGroupAlreadyExistsException from "../../exceptions/UserGroupAlreadyExistException";
import DbCreatingNewUserGroupException from "../../exceptions/DbCreatingNewUserGroupException";
import SysEnv from "../../modules/SysEnv";
import UserGroupModel from '../models/userGroup.model';
import validationUserGroupMiddleware from '../../middleware/validate.userGroup.middleware';
import adminAuthMiddleware from '../../middleware/admin.auth.middleware';



export class UserGroupsController implements Controller{
  public path='/userGroups';
  public router= express.Router();
  private userGroups = new UserGroupModel();
  private siteCode = '';

  constructor() {
    this.siteCode = SysEnv.SITE_CODE;
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationUserGroupMiddleware(),
                    this.create);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byUserGroupId/:userGroupId', authMiddleware, this.findById);
    this.router.patch(this.path+'/:userGroupId',
                        authMiddleware,
                        validationUpdateMiddleware(userGroups_schema),
                        validationUserGroupMiddleware(),
                         this.update);
    this.router.get(this.path+'/byUserId/:userId', authMiddleware, this.findByUserId);
    this.router.get(this.path+'/byAccountId/:accountId', authMiddleware, this.findByAccountId);
    this.router.get(this.path+'/byGroupId/:groupId', authMiddleware, this.findByGroupId);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UserGroupsDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdUserGroupsDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(userGroups_schema);
  }


  private create = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userGroup = new UserGroupsDTO(request.body) as UserGroupData;
    userGroup.site_code = this.siteCode;
    const groups = await this.userGroups.find({
      site_code: this.siteCode,
      user_id: userGroup.user_id,
      group_id: userGroup.group_id
     })
    if (
      CommonFn.isUndefined(groups) || groups?.length === 0
    ) {
      next(new UserGroupAlreadyExistsException(userGroup.user_id, userGroup.group_id));
    } else {
      userGroup.site_code = this.siteCode;
      const newUserGroup = await this.userGroups.create(userGroup);
      if (newUserGroup) {
        response.send(newUserGroup);
      } else {
        next(new DbCreatingNewUserGroupException(userGroup.user_id, userGroup.group_id));
      }
    }
  }

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userGroups.findById(request.params.userGroupId).then((respUserGroupsDTO) => {
      if (respUserGroupsDTO) {
        response.send(respUserGroupsDTO);
      } else {
        next(new DataNotFoundException(request.params.userGroupId))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userGroups.getAll().then((respUserGroupsDTOArray) => {
      if (respUserGroupsDTOArray) {
        response.send(respUserGroupsDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userGroups.updateById(request.params.userGroupId, request.body).then((respUserGroupsDTO) => {
      if (respUserGroupsDTO) {
        response.send(respUserGroupsDTO);
      } else {
        next(new DataNotFoundException(request.params.userGroupId))
      }
    })
  }

  findByUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userGroups.findByUserId(request.params.userId).then((respUserGroupsDTO) => {
      if (respUserGroupsDTO) {
        response.send(respUserGroupsDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }

  findByAccountId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userGroups.findByAccountId(request.params.accountId).then((respUserGroupsDTO) => {
      if (respUserGroupsDTO) {
        response.send(respUserGroupsDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }

  findByGroupId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userGroups.findByGroupId(request.params.groupId).then((respUserGroupsDTO) => {
      if (respUserGroupsDTO) {
        response.send(respUserGroupsDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }
}
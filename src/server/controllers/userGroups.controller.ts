import { CommonFn } from '../../modules/CommonFnModule';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { userGroups_schema } from "../../schemas/userGroups.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import { UserGroupsDTO } from "../../dtos/userGroups.DTO";

import UserGroupAlreadyExistsException from "../../exceptions/UserGroupAlreadyExistException";
import DbCreatingNewUserGroupException from "../../exceptions/DbCreatingNewUserGroupException";
import SysEnv from "../../modules/SysEnv";
import UserGroupModel from '../models/userGroup.model';
import validationUserGroupMiddleware from '../../middleware/validate.UserGroup.middleware';



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
    return;
  }


  private create = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userGroup = new UserGroupsDTO(request.body);
    userGroup.data.site_code = this.siteCode;
    const groups = await this.userGroups.find({
      site_code: this.siteCode,
      user_id: userGroup.data.user_id,
      group_id: userGroup.data.group_id
     })
    if (
      CommonFn.isUndefined(groups) || groups?.length === 0
    ) {
      next(new UserGroupAlreadyExistsException(userGroup.data.user_id, userGroup.data.group_id));
    } else {
      userGroup.data.site_code = this.siteCode;
      const newUserGroup = await this.userGroups.create(userGroup);
      if (newUserGroup) {
        response.send(newUserGroup.data);
      } else {
        next(new DbCreatingNewUserGroupException(userGroup.data.user_id, userGroup.data.group_id));
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
}
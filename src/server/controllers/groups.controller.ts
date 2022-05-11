import { GroupDTO, UpdGroupDTO } from '../../dtos/groups.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {GroupModel} from "../models/group.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { socialGroups_schema } from "../../schemas/groups.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";



export class GroupsController implements Controller{
  public path='/groups';
  public router= express.Router();
  private groups = new GroupModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(socialGroups_schema),
                    this.newGroup);
    this.router.get(this.path+'/byAccountId/:accountId', authMiddleware, this.getByAccountId);
    this.router.get(this.path+'/byGroupId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(socialGroups_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new GroupDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdGroupDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(socialGroups_schema);
  }

  newGroup  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.groups.create(request.body).then((respGroupDTO) => {
        if (respGroupDTO) {
            response.send(respGroupDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.groups.findById(request.params.id).then((respGroupDTO) => {
      if (respGroupDTO) {
        response.send(respGroupDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.groups.updateById(request.params.id, request.body).then((respGroupDTO) => {
      if (respGroupDTO) {
        response.send(respGroupDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getByAccountId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.groups.findByAccountId(request.params.accountId).then((respGroupDTOArray) => {
      if (respGroupDTOArray) {
        response.send(respGroupDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

}
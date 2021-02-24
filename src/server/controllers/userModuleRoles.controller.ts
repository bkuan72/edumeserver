import { UserModuleRoleDTO, UpdUserModuleRoleDTO } from './../../dtos/userModuleRoles.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {UserModuleRoleModel} from "../models/userModuleRole.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { userModuleRoles_schema } from "../../schemas/userModuleRoles.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";



export class UserModuleRolesController implements Controller{
  public path='/userModuleRoles';
  public router= express.Router();
  private userModuleRoles = new UserModuleRoleModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(userModuleRoles_schema),
                    this.newUserModuleRole);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byUserId/:id', authMiddleware, this.findByUserId);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(userModuleRoles_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UserModuleRoleDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdUserModuleRoleDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(userModuleRoles_schema);
  }

  newUserModuleRole  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.userModuleRoles.create(request.body).then((respUserModuleRoleDTO) => {
        if (respUserModuleRoleDTO) {
            response.send(respUserModuleRoleDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userModuleRoles.findById(request.params.id).then((respUserModuleRoleDTO) => {
      if (respUserModuleRoleDTO) {
        response.send(respUserModuleRoleDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userModuleRoles.getAll().then((respUserModuleRoleDTOArray) => {
      if (respUserModuleRoleDTOArray) {
        response.send(respUserModuleRoleDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userModuleRoles.updateById(request.params.id, request.body).then((respUserModuleRoleDTO) => {
      if (respUserModuleRoleDTO) {
        response.send(respUserModuleRoleDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  findByUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userModuleRoles.getUserModuleRoles(this.siteCode, request.params.userId).then((respUserModuleRoleDTO) => {
      if (respUserModuleRoleDTO) {
        response.send(respUserModuleRoleDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }
}
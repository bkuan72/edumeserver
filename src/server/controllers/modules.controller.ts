import { RoleDTO, UpdRoleDTO } from './../../dtos/roles.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {RoleModel} from "../models/role.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { roles_schema } from "../../schemas/roles.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";



export class ModulesController implements Controller{
  public path='/roles';
  public router= express.Router();
  private roles = new RoleModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(roles_schema),
                    this.newRole);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(roles_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new RoleDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdRoleDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(roles_schema);
  }

  newRole  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.roles.create(request.body).then((respRoleDTO) => {
        if (respRoleDTO) {
            response.send(respRoleDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.roles.findById(request.params.id).then((respRoleDTO) => {
      if (respRoleDTO) {
        response.send(respRoleDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.roles.getAll().then((respRoleDTOArray) => {
      if (respRoleDTOArray) {
        response.send(respRoleDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.roles.updateById(request.params.id, request.body).then((respRoleDTO) => {
      if (respRoleDTO) {
        response.send(respRoleDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }
}
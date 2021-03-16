import { AdAgeGroupDTO, UpdAdAgeGroupDTO } from '../../dtos/adAgeGroups.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AdAgeGroupModel} from "../models/adAgeGroup.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { adAgeGroups_schema } from "../../schemas/adAgeGroups.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";



export class AdAgeGroupsController implements Controller{
  public path='/adAgeGroups';
  public router= express.Router();
  private adAgeGroups = new AdAgeGroupModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(adAgeGroups_schema),
                    this.newAdAgeGroup);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/codesOnly', authMiddleware, this.getCodesOnly);
    this.router.get(this.path+'/byAgeGroupCode/:ageGroup', authMiddleware, this.findByAgeGroup);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(adAgeGroups_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    this.router.put(this.path+'/delete/:id', authMiddleware, this.delete);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AdAgeGroupDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAdAgeGroupDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(adAgeGroups_schema);
  }

  newAdAgeGroup  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.adAgeGroups.create(request.body).then((respAdAgeGroupDTO) => {
        if (respAdAgeGroupDTO) {
            response.send(respAdAgeGroupDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findByAgeGroup  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adAgeGroups.find({side_code: this.siteCode,
                            adAgeGroup_code: request.params.ageGroup}).then((respAdAgeGroupDTOArray) => {
      if (respAdAgeGroupDTOArray) {
        response.send(respAdAgeGroupDTOArray);
      } else {
        next(new DataNotFoundException(request.params.ageGroup))
      }
    })
  }

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adAgeGroups.findById(request.params.id).then((respAdAgeGroupDTO) => {
      if (respAdAgeGroupDTO) {
        response.send(respAdAgeGroupDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adAgeGroups.getAll().then((respAdAgeGroupDTOArray) => {
      if (respAdAgeGroupDTOArray) {
        response.send(respAdAgeGroupDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  getCodesOnly  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adAgeGroups.getCodesOnly().then((respAdAgeGroupDTOArray) => {
      if (respAdAgeGroupDTOArray) {
        response.send(respAdAgeGroupDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adAgeGroups.updateById(request.params.id, request.body).then((respAdAgeGroupDTO) => {
      if (respAdAgeGroupDTO) {
        response.send(respAdAgeGroupDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  delete  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adAgeGroups.remove(request.params.id).then((respAdAgeGroupDTO) => {
      if (respAdAgeGroupDTO) {
        response.send(respAdAgeGroupDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }
}
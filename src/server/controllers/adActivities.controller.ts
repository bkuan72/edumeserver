import { AdActivityDTO, UpdAdActivityDTO } from './../../dtos/adActivities.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AdActivityModel} from "../models/adActivity.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { adActivities_schema } from "../../schemas/adActivities.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";



export class AdActivitiesController implements Controller{
  public path='/adActivities';
  public router= express.Router();
  private adActivities = new AdActivityModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(adActivities_schema),
                    this.newAdActivity);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byActivityCode/:activity', authMiddleware, this.findByActivity);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(adActivities_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    this.router.put(this.path+'/delete/:id', authMiddleware, this.delete);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AdActivityDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAdActivityDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(adActivities_schema);
  }

  newAdActivity  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.adActivities.create(request.body).then((respAdActivityDTO) => {
        if (respAdActivityDTO) {
            response.send(respAdActivityDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findByActivity  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adActivities.find({side_code: this.siteCode,
                            adActivity_code: request.params.activity}).then((respAdActivityDTOArray) => {
      if (respAdActivityDTOArray) {
        response.send(respAdActivityDTOArray);
      } else {
        next(new DataNotFoundException(request.params.activity))
      }
    })
  }

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adActivities.findById(request.params.id).then((respAdActivityDTO) => {
      if (respAdActivityDTO) {
        response.send(respAdActivityDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adActivities.getAll().then((respAdActivityDTOArray) => {
      if (respAdActivityDTOArray) {
        response.send(respAdActivityDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adActivities.updateById(request.params.id, request.body).then((respAdActivityDTO) => {
      if (respAdActivityDTO) {
        response.send(respAdActivityDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  delete  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adActivities.remove(request.params.id).then((respAdActivityDTO) => {
      if (respAdActivityDTO) {
        response.send(respAdActivityDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }
}
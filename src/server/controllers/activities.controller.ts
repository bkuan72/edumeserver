/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {ActivityModel} from "../models/activity.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import { activities_schema } from "../../schemas/activities.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import { ActivityDTO, UpdActivityDTO } from "../../dtos/activities.DTO";
import NoDataException from "../../exceptions/NoDataExceptions";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";

export class ActivitiesController implements Controller{
  public path='/activities';
  public router= express.Router();
  private activities = new ActivityModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(activities_schema),
                    this.newActivity);
    this.router.get(this.path+'/activityList/byUserIdOffSetDays/:userId/:offSetDays', authMiddleware, this.getActivitiesByUserId);
    this.router.get(this.path+'/byActivityId/:activityId', authMiddleware, this.findById);
    this.router.patch(this.path+'/:activityId', authMiddleware, validationUpdateMiddleware(activities_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new ActivityDTO();
    response.send(dto.data);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdActivityDTO();
    response.send(dto.data);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(activities_schema);
  }

  newActivity  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.activities.create(request.body).then((respActivityDTO) => {
        if (respActivityDTO) {
            response.send(respActivityDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.activities.findById(request.params.activityId).then((respActivityDTO) => {
      if (respActivityDTO) {
        response.send(respActivityDTO.data);
      } else {
        next(new DataNotFoundException(request.params.activityId))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.activities.updateById(request.params.activityId, request.body).then((respActivityDTO) => {
      if (respActivityDTO) {
        response.send(respActivityDTO);
      } else {
        next(new DataNotFoundException(request.params.activityId))
      }
    })
  }

  getActivitiesByUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.activities.findByUserId(request.params.userId, request.params.offSetDays).then((respActivityDTO: ActivityDTO[]) => {
      if (respActivityDTO) {
        response.send(respActivityDTO);
      } else {
        next(new NoDataException())
      }
    })
  }
}
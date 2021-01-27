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

    this.router.post(this.path+'/likes',
                authMiddleware,
                validationMiddleware(activities_schema),
                this.addNewLikeActivity);
    this.router.get(this.path+'/activityList/byTimelineUserIdOffSetDays/:timelineUserId/:offSetDays', authMiddleware, this.getActivitiesByTimelineUserId);
    this.router.get(this.path+'/byActivityId/:activityId', authMiddleware, this.findById);
    this.router.patch(this.path+'/:activityId', authMiddleware, validationUpdateMiddleware(activities_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    this.router.put(this.path+'/remove/:activityId', authMiddleware, this.removeById);
    this.router.get(this.path+'/likes/byTimelineIdUserId/:timelineId/:userId', authMiddleware, this.getLikeActivityByTimelineIdUserId);
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

  removeById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.activities.remove(request.params.activityId).then((activityIdDTO) => {
      if (activityIdDTO) {
        response.send(activityIdDTO);
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

  getActivitiesByTimelineUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.activities.findByTimelineUserId(request.params.timelineUserId, request.params.offSetDays).then((respActivityDTO: ActivityDTO[]) => {
      if (respActivityDTO) {
        response.send(respActivityDTO);
      } else {
        next(new NoDataException())
      }
    })
  }

  getLikeActivityByTimelineIdUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.activities.findByTypeTimelineIdUserId(
              'LIKES',
              request.params.timelineId,
              request.params.userId).then((respActivityDTO: ActivityDTO[]) => {
      if (respActivityDTO) {
        response.send(respActivityDTO);
      } else {
        next(new NoDataException())
      }
    })
  }

  addNewLikeActivity = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.activities.create({
                              user_id: request.body.user_id,
                              timeline_id: request.body.timeline_id,
                              timeline_user_id: request.body.timeline_user_id,
                              activity_type: 'LIKES',
                              message: request.body.message,
                              activity_date: new Date().toISOString()
                            }).then((respActivityDTO: ActivityDTO[]) => {
      if (respActivityDTO) {
        response.send(respActivityDTO);
      } else {
        next(new NoDataException())
      }
    })
  }

}
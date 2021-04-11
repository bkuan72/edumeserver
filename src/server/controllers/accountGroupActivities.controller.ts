/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AccountGroupActivityModel} from "../models/accountGroupActivity.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import { accountGroupActivities_schema } from "../../schemas/accountGroupActivities.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import { AccountGroupActivityDTO, UpdAccountGroupActivityDTO } from "../../dtos/accountGroupActivities.DTO";
import NoDataException from "../../exceptions/NoDataExceptions";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";

export class AccountGroupActivitiesController implements Controller{
  public path='/accountGroupActivities';
  public router= express.Router();
  private accountGroupActivities = new AccountGroupActivityModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {

    this.router.post(this.path+'/account/likes',
                authMiddleware,
                validationMiddleware(accountGroupActivities_schema),
                this.addNewLikeAccountActivity);
    this.router.get(this.path+'/accountActivityList/byTimelineAccountIdOffSetDays/:timelineAccountId/:offSetDays', authMiddleware, this.getActivitiesByTimelineAccountId);
    this.router.get(this.path+'/account/likes/byTimelineIdAccountId/:timelineId/:accountId', authMiddleware, this.getLikeAccountGroupActivityByTimelineIdAccountId);

    this.router.post(this.path+'/group/likes',
                authMiddleware,
                validationMiddleware(accountGroupActivities_schema),
                this.addNewLikeGroupActivity);
    this.router.get(this.path+'/groupActivityList/byTimelineGroupIdOffSetDays/:timelineGroupId/:offSetDays', authMiddleware, this.getActivitiesByTimelineGroupId);
    this.router.get(this.path+'/group/likes/byTimelineIdGroupId/:timelineId/:groupId', authMiddleware, this.getLikeAccountGroupActivityByTimelineIdGroupId);



    this.router.get(this.path+'/byAccountGroupActivityId/:accountGroupActivityId', authMiddleware, this.findById);
    this.router.patch(this.path+'/:accountGroupActivityId', authMiddleware, validationUpdateMiddleware(accountGroupActivities_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    this.router.patch(this.path+'/remove/:accountGroupActivityId', authMiddleware, this.removeById);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AccountGroupActivityDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAccountGroupActivityDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(accountGroupActivities_schema);
  }

  newAccountGroupActivity  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.accountGroupActivities.create(request.body).then((respAccountGroupActivityDTO) => {
        if (respAccountGroupActivityDTO) {
            response.send(respAccountGroupActivityDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupActivities.findById(request.params.accountGroupActivityId).then((respAccountGroupActivityDTO) => {
      if (respAccountGroupActivityDTO) {
        response.send(respAccountGroupActivityDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupActivityId))
      }
    })
  }

  removeById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupActivities.deleteById(request.params.accountGroupActivityId).then((accountGroupActivityIdDTO) => {
      if (accountGroupActivityIdDTO) {
        response.send(accountGroupActivityIdDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupActivityId))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupActivities.updateById(request.params.accountGroupActivityId, request.body).then((respAccountGroupActivityDTO) => {
      if (respAccountGroupActivityDTO) {
        response.send(respAccountGroupActivityDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupActivityId))
      }
    })
  }

  getActivitiesByTimelineAccountId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupActivities.findByTimelineAccountId(request.params.timelineAccountId, request.params.offSetDays).then((respAccountGroupActivityDTO: AccountGroupActivityDTO[]) => {
      if (respAccountGroupActivityDTO) {
        response.send(respAccountGroupActivityDTO);
      } else {
        next(new NoDataException())
      }
    })
  }

  getActivitiesByTimelineGroupId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupActivities.findByTimelineAccountId(request.params.timelineGroupId, request.params.offSetDays).then((respAccountGroupActivityDTO: AccountGroupActivityDTO[]) => {
      if (respAccountGroupActivityDTO) {
        response.send(respAccountGroupActivityDTO);
      } else {
        next(new NoDataException())
      }
    })
  }

  getLikeAccountGroupActivityByTimelineIdAccountId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupActivities.findByTypeTimelineIdAccountId(
              'LIKES',
              request.params.timelineId,
              request.params.accountId).then((respAccountGroupActivityDTO: AccountGroupActivityDTO[]) => {
      if (respAccountGroupActivityDTO) {
        response.send(respAccountGroupActivityDTO);
      } else {
        next(new NoDataException())
      }
    })
  }

  getLikeAccountGroupActivityByTimelineIdGroupId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupActivities.findByTypeTimelineIdGroupId(
              'LIKES',
              request.params.timelineId,
              request.params.groupId).then((respAccountGroupActivityDTO: AccountGroupActivityDTO[]) => {
      if (respAccountGroupActivityDTO) {
        response.send(respAccountGroupActivityDTO);
      } else {
        next(new NoDataException())
      }
    })
  }

  addNewLikeAccountActivity = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupActivities.create({
                              user_id: request.body.user_id,
                              timeline_id: request.body.timeline_id,
                              timeline_account_id: request.body.timeline_account_id,
                              accountGroupActivity_type: 'LIKES',
                              message: request.body.message,
                              accountGroupActivity_date: new Date().toISOString()
                            }).then((respAccountGroupActivityDTO: AccountGroupActivityDTO[]) => {
      if (respAccountGroupActivityDTO) {
        response.send(respAccountGroupActivityDTO);
      } else {
        next(new NoDataException())
      }
    })
  }

  addNewLikeGroupActivity = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupActivities.create({
                              user_id: request.body.user_id,
                              timeline_id: request.body.timeline_id,
                              timeline_group_id: request.body.timeline_group_id,
                              accountGroupActivity_type: 'LIKES',
                              message: request.body.message,
                              accountGroupActivity_date: new Date().toISOString()
                            }).then((respAccountGroupActivityDTO: AccountGroupActivityDTO[]) => {
      if (respAccountGroupActivityDTO) {
        response.send(respAccountGroupActivityDTO);
      } else {
        next(new NoDataException())
      }
    })
  }
}
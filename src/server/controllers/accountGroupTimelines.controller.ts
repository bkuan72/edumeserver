import { ActivityModel } from './../models/activity.model';
import { UpdAccountGroupTimelineDTO } from './../../dtos/accountGroupTimelines.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AccountGroupTimelineModel} from "../models/accountGroupTimeline.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { accountGroupTimelines_schema } from "../../schemas/accountGroupTimelines.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";
import { AccountGroupTimelineDTO } from "../../dtos/accountGroupTimelines.DTO";
import { TimelinePostDTO } from '../../dtos/accountGroupTimelines.DTO';
import devAuthMiddleware from '../../middleware/dev.auth.middleware';
import UpdateDataFailedException from '../../exceptions/UpdateDataFailedException';



export class AccountGroupTimelinesController implements Controller{
  public path='/accountGroupTimelines';
  public router= express.Router();
  private accountGroupTimelines = new AccountGroupTimelineModel();
  private accountGroupTimelineActivities = new ActivityModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(accountGroupTimelines_schema),
                    this.newAccountGroupTimelines);
    this.router.get(this.path+'/byTimelineId/:timelineId', authMiddleware, this.getByTimelineId);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(accountGroupTimelines_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    this.router.get(this.path+'/timelineDTO', devAuthMiddleware, this.apiTimelineDTO);
    this.router.get(this.path+'/profile-timeline/timelineAccountIdNOffsetDays/:accountId/:offSetDays', authMiddleware, this.getAccountTimeline);
    this.router.get(this.path+'/profile-timeline/timelineGroupIdNOffsetDays/:groupId/:offSetDays', authMiddleware, this.getGroupTimeline);
    this.router.put(this.path+'/like/:timelineId', authMiddleware, this.incrementTimelineLikes);
    this.router.put(this.path+'/unlike/:timelineId', authMiddleware, this.decrementTimelineLikes);
    this.router.put(this.path+'/share/:timelineId', authMiddleware, this.updateShared);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AccountGroupTimelineDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAccountGroupTimelineDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(accountGroupTimelines_schema);
  }
  apiTimelineDTO  = (request: express.Request, response: express.Response) => {
    const dto = new TimelinePostDTO();
    response.send(dto);
  }

  newAccountGroupTimelines  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.accountGroupTimelines.create(request.body).then((respAccountGroupTimelineDTO) => {
        if (respAccountGroupTimelineDTO) {
            response.send(respAccountGroupTimelineDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
      .catch((err) => {
        throw(err);
      });
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelines.findById(request.params.id).then((respAccountGroupTimelineDTO) => {
      if (respAccountGroupTimelineDTO) {
        response.send(respAccountGroupTimelineDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelines.updateById(request.params.id, request.body).then((respAccountGroupTimelineDTO) => {
      if (respAccountGroupTimelineDTO) {
        response.send(respAccountGroupTimelineDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  getByTimelineId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelines.findByTimelineId(request.params.timelineId).then((respAccountGroupTimelineDTOArray) => {
      if (respAccountGroupTimelineDTOArray) {
        response.send(respAccountGroupTimelineDTOArray);
      } else {
        next(new NoDataException())
      }
    })
    .catch((err) => {
      throw(err);
    });
  }


  getAccountTimeline  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelines.findAccountTimeline(request.params.accountId,
                                            request.params.offSetDays).then((respPostDTO: AccountGroupTimelineDTO[]) => {
      if (respPostDTO) {
        response.send(respPostDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  getGroupTimeline  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelines.findGroupTimeline(request.params.groupId,
                                            request.params.offSetDays).then((respPostDTO: AccountGroupTimelineDTO[]) => {
      if (respPostDTO) {
        response.send(respPostDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  incrementTimelineLikes  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelines.incrementLikesById(request.params.timelineId).then((respPostDTO) => {
        if (respPostDTO) {
          response.send(respPostDTO);
          } else {
            next(new DataNotFoundException(request.body.timelineId));
          }
      })
      .catch(() => {
        next(new UpdateDataFailedException('Likes For Timeline id: ', request.body.timelineId));
      });
  }
  decrementTimelineLikes  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelines.decrementLikesById(request.params.timelineId).then((respPostDTO) => {
        if (respPostDTO) {
          response.send(respPostDTO);
          } else {
            next(new DataNotFoundException(request.body.timelineId));
          }
      })
      .catch(() => {
        next(new UpdateDataFailedException('Likes For Timeline id: ', request.body.timelineId));
      });
  }


  updateShared  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelines.incrementShareById(request.params.timelineId).then((respPostDTO) => {
      if (respPostDTO) {
        response.send(respPostDTO);
      } else {
        next(new DataNotFoundException(request.params.timelineId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

}
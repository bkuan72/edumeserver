import { AccountDTO } from './../../dtos/accounts.DTO';
import { ActivityModel } from './../models/activity.model';
import { UpdUserTimelineDTO } from './../../dtos/userTimelines.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {UserTimelineModel} from "../models/userTimeline.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { userTimelines_schema } from "../../schemas/userTimelines.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";
import { UserTimelineDTO } from "../../dtos/userTimelines.DTO";
import { TimelinePostDTO } from '../../dtos/userTimelines.DTO';
import devAuthMiddleware from '../../middleware/dev.auth.middleware';
import UpdateDataFailedException from '../../exceptions/UpdateDataFailedException';



export class UserTimelinessController implements Controller{
  public path='/userTimelines';
  public router= express.Router();
  private userTimelines = new UserTimelineModel();
  private userTimelineActivities = new ActivityModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(userTimelines_schema),
                    this.newUserTimelines);
    this.router.get(this.path+'/byTimelineId/:timelineId', authMiddleware, this.getByTimelineId);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(userTimelines_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    this.router.get(this.path+'/timelineDTO', devAuthMiddleware, this.apiTimelineDTO);
    this.router.get(this.path+'/profile-timeline/timelineUserIdNOffsetDays/:timelineUserId/:offSetDays', authMiddleware, this.getTimeline);
    this.router.put(this.path+'/like/:timelineId', authMiddleware, this.incrementTimelineLikes);
    this.router.put(this.path+'/unlike/:timelineId', authMiddleware, this.decrementTimelineLikes);
    this.router.put(this.path+'/share/:timelineId', authMiddleware, this.updateShared);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UserTimelineDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdUserTimelineDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(userTimelines_schema);
  }
  apiTimelineDTO  = (request: express.Request, response: express.Response) => {
    const dto = new TimelinePostDTO();
    response.send(dto);
  }

  newUserTimelines  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.userTimelines.create(request.body).then((respUserTimelineDTO) => {
        if (respUserTimelineDTO) {
            response.send(respUserTimelineDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userTimelines.findById(request.params.id).then((respUserTimelineDTO) => {
      if (respUserTimelineDTO) {
        response.send(respUserTimelineDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userTimelines.updateById(request.params.id, request.body).then((respUserTimelineDTO) => {
      if (respUserTimelineDTO) {
        response.send(respUserTimelineDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getByTimelineId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userTimelines.findByTimelineId(request.params.timelineId).then((respUserTimelineDTOArray) => {
      if (respUserTimelineDTOArray) {
        response.send(respUserTimelineDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }


  getTimeline  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userTimelines.findTimeline(request.params.timelineUserId, request.params.offSetDays).then((respPostDTO: UserTimelineDTO[]) => {
      if (respPostDTO) {
        response.send(respPostDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }

  incrementTimelineLikes  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userTimelines.incrementLikesById(request.params.timelineId).then((respPostDTO) => {
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
    this.userTimelines.decrementLikesById(request.params.timelineId).then((respPostDTO) => {
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
    this.userTimelines.incrementShareById(request.params.timelineId).then((respPostDTO) => {
      if (respPostDTO) {
        response.send(respPostDTO);
      } else {
        next(new DataNotFoundException(request.params.timelineId))
      }
    })
  }

}
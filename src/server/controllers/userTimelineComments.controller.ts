import { UserTimelineCommentDTO, UpdUserTimelineCommentDTO } from '../../dtos/userTimelineComments.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {UserTimelineCommentModel} from "../models/userTimelineComment.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { userTimelineComments_schema } from "../../schemas/userTimelineComments.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from '../../middleware/admin.auth.middleware';



export class UserTimelineCommentsController implements Controller{
  public path='/userTimelineComments';
  public router= express.Router();
  private userTimelineComments = new UserTimelineCommentModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(userTimelineComments_schema),
                    this.newUserTimelineComment);
    this.router.get(this.path+'/byTimelineId/:timelineId', authMiddleware, this.getByTimelineId);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(userTimelineComments_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UserTimelineCommentDTO();
    response.send(dto.data);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdUserTimelineCommentDTO();
    response.send(dto.data);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(userTimelineComments_schema);
  }

  newUserTimelineComment  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.userTimelineComments.create(request.body).then((respUserTimelineCommentDTO) => {
        if (respUserTimelineCommentDTO) {
            response.send(respUserTimelineCommentDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userTimelineComments.findById(request.params.id).then((respUserTimelineCommentDTO) => {
      if (respUserTimelineCommentDTO) {
        response.send(respUserTimelineCommentDTO.data);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userTimelineComments.updateById(request.params.id, request.body).then((respUserTimelineCommentDTO) => {
      if (respUserTimelineCommentDTO) {
        response.send(respUserTimelineCommentDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getByTimelineId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userTimelineComments.findByTimelineId(request.params.timelineId).then((respUserTimelineCommentDTOArray) => {
      if (respUserTimelineCommentDTOArray) {
        response.send(respUserTimelineCommentDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

}
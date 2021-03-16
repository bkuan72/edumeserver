import { AccountGroupTimelineCommentDTO, UpdAccountGroupTimelineCommentDTO } from '../../dtos/accountGroupTimelineComments.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AccountGroupTimelineCommentModel} from "../models/accountGroupTimelineComment.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { accountGroupTimelineComments_schema } from "../../schemas/accountGroupTimelineComments.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from '../../middleware/admin.auth.middleware';



export class AccountGroupTimelineCommentsController implements Controller{
  public path='/accountGroupTimelineComments';
  public router= express.Router();
  private accountGroupTimelineComments = new AccountGroupTimelineCommentModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(accountGroupTimelineComments_schema),
                    this.newAccountGroupTimelineComment);
    this.router.get(this.path+'/byTimelineId/:timelineId', authMiddleware, this.getByTimelineId);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(accountGroupTimelineComments_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AccountGroupTimelineCommentDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAccountGroupTimelineCommentDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(accountGroupTimelineComments_schema);
  }

  newAccountGroupTimelineComment  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.accountGroupTimelineComments.create(request.body).then((respAccountGroupTimelineCommentDTO) => {
        if (respAccountGroupTimelineCommentDTO) {
            response.send(respAccountGroupTimelineCommentDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelineComments.findById(request.params.id).then((respAccountGroupTimelineCommentDTO) => {
      if (respAccountGroupTimelineCommentDTO) {
        response.send(respAccountGroupTimelineCommentDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelineComments.updateById(request.params.id, request.body).then((respAccountGroupTimelineCommentDTO) => {
      if (respAccountGroupTimelineCommentDTO) {
        response.send(respAccountGroupTimelineCommentDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getByTimelineId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupTimelineComments.findByTimelineId(request.params.timelineId).then((respAccountGroupTimelineCommentDTOArray) => {
      if (respAccountGroupTimelineCommentDTOArray) {
        response.send(respAccountGroupTimelineCommentDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

}
import { PostMediaDTO } from '../../dtos/postMedias.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {UserMediaPeriodModel} from "../models/userMediaPeriod.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { userMediaPeriods_schema } from "../../schemas/userMediaPeriods.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from '../../middleware/admin.auth.middleware';
import { UpdUserMediaPeriodDTO, UserMediaPeriodDataDTO } from '../../dtos/userMediaPeriods.DTO';



export class UserMediaPeriodsController implements Controller{
  public path='/userMediaPeriods';
  public router= express.Router();
  private userMediaPeriods = new UserMediaPeriodModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(userMediaPeriods_schema),
                    this.newMedia);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(userMediaPeriods_schema), this.update);
    this.router.get(this.path+'/byUserId/:userId', authMiddleware, this.findByUserId);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    this.router.get(this.path+'/dataDTO', adminAuthMiddleware, this.apiDataDTO);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new PostMediaDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdUserMediaPeriodDTO();
    response.send(dto);
  }
  apiDataDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UserMediaPeriodDataDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(userMediaPeriods_schema);
  }

  newMedia  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.userMediaPeriods.create(request.body).then((respMediaDTO) => {
        if (respMediaDTO) {
            response.send(respMediaDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userMediaPeriods.findById(request.params.id).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userMediaPeriods.getAll().then((respMediaDTOArray) => {
      if (respMediaDTOArray) {
        response.send(respMediaDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userMediaPeriods.updateById(request.params.id, request.body).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  findByUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userMediaPeriods.findByUserId(request.params.userId).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }
}
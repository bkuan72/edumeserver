import { PostMediaDTO } from '../../dtos/postMedias.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AccountGroupMediaPeriodModel} from "../models/accountGroupMediaPeriod.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { accountGroupMediaPeriods_schema } from "../../schemas/accountGroupMediaPeriods.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from '../../middleware/admin.auth.middleware';
import { AccountGroupMediaPeriodDataDTO, UpdAccountGroupMediaPeriodDTO } from '../../dtos/accountGroupMediaPeriods.DTO';



export class AccountGroupMediaPeriodsController implements Controller{
  public path='/accountGroupMediaPeriods';
  public router= express.Router();
  private accountGroupMediaPeriods = new AccountGroupMediaPeriodModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(accountGroupMediaPeriods_schema),
                    this.newMedia);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(accountGroupMediaPeriods_schema), this.update);
    this.router.get(this.path+'/byAccountGroupId/:accountId/:groupId', authMiddleware, this.findByAccountGroupId);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new PostMediaDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAccountGroupMediaPeriodDTO();
    response.send(dto);
  }
  apiDataDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AccountGroupMediaPeriodDataDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(accountGroupMediaPeriods_schema);
  }

  newMedia  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.accountGroupMediaPeriods.create(request.body).then((respMediaDTO) => {
        if (respMediaDTO) {
            response.send(respMediaDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMediaPeriods.findById(request.params.id).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMediaPeriods.getAll().then((respMediaDTOArray) => {
      if (respMediaDTOArray) {
        response.send(respMediaDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMediaPeriods.updateById(request.params.id, request.body).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  findByAccountGroupId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMediaPeriods.findByAccountGroupId(request.params.accountId, request.params.groupId).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }
}
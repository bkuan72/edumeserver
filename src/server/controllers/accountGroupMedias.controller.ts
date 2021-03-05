import { PostMediaDTO } from '../../dtos/postMedias.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AccountGroupMediaModel} from "../models/accountGroupMedia.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { accountGroupMedias_schema } from "../../schemas/accountGroupMedias.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from '../../middleware/admin.auth.middleware';
import { UpdAccountGroupMediaDTO } from '../../dtos/accountGroupMedias.DTO';



export class AccountGroupMediasController implements Controller{
  public path='/accountGroupMedias';
  public router= express.Router();
  private accountGroupMedias = new AccountGroupMediaModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(accountGroupMedias_schema),
                    this.newMedia);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(accountGroupMedias_schema), this.update);
    this.router.get(this.path+'/byAccountGroupMediaPeriodId/:accountGroupMediaPeriodId', authMiddleware, this.findByAccountGroupMediaPeriodId);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    this.router.get(this.path+'/fullImage/:id', authMiddleware, this.findFullImageById);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new PostMediaDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAccountGroupMediaDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(accountGroupMedias_schema);
  }

  newMedia  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.accountGroupMedias.create(request.body).then((respMediaDTO) => {
        if (respMediaDTO) {
            response.send(respMediaDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findFullImageById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMedias.findFullImageById(request.params.id).then((respFullImageDTO) => {
      if (respFullImageDTO) {
        response.send(respFullImageDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMedias.findById(request.params.id).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMedias.getAll().then((respMediaDTOArray) => {
      if (respMediaDTOArray) {
        response.send(respMediaDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMedias.updateById(request.params.id, request.body).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  findByAccountGroupMediaPeriodId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMedias.findByAccountGroupMediaPeriodId(request.params.accountGroupMediaPeriodId).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }
}
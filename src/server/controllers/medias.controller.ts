import { PostMediaDTO } from './../../dtos/postMedias.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {MediaModel} from "../models/media.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { medias_schema } from "../../schemas/medias.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from '../../middleware/admin.auth.middleware';
import { UpdMediaDTO } from '../../dtos/medias.DTO';



export class MediasController implements Controller{
  public path='/medias';
  public router= express.Router();
  private medias = new MediaModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(medias_schema),
                    this.newMedia);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(medias_schema), this.update);
    this.router.get(this.path+'/byUserId/:userId', authMiddleware, this.findByUserId);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new PostMediaDTO();
    response.send(dto.data);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdMediaDTO();
    response.send(dto.data);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(medias_schema);
  }

  newMedia  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.medias.create(request.body).then((respMediaDTO) => {
        if (respMediaDTO) {
            response.send(respMediaDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.medias.findById(request.params.id).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO.data);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.medias.getAll().then((respMediaDTOArray) => {
      if (respMediaDTOArray) {
        response.send(respMediaDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.medias.updateById(request.params.id, request.body).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  findByUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.medias.findByUserId(request.params.userId).then((respMediaDTO) => {
      if (respMediaDTO) {
        response.send(respMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }
}
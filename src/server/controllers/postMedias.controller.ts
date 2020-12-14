/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {PostMediaModel} from "../models/postMedia.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { postMedias_schema } from "../../schemas/postMedias.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";



export class PostMediasController implements Controller{
  public path='/postMedias';
  public router= express.Router();
  private postMedias = new PostMediaModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(postMedias_schema),
                    this.newPostMedia);
    this.router.get(this.path+'/byPostId/:postId', authMiddleware, this.getByPostId);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(postMedias_schema), this.update);
    return;
  }

  newPostMedia  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.postMedias.create(request.body).then((respPostMediaDTO) => {
        if (respPostMediaDTO) {
            response.send(respPostMediaDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.postMedias.findById(request.params.id).then((respPostMediaDTO) => {
      if (respPostMediaDTO) {
        response.send(respPostMediaDTO.data);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.postMedias.updateById(request.params.id, request.body).then((respPostMediaDTO) => {
      if (respPostMediaDTO) {
        response.send(respPostMediaDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getByPostId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.postMedias.findByPostId(request.params.postId).then((respPostMediaDTOArray) => {
      if (respPostMediaDTOArray) {
        response.send(respPostMediaDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

}
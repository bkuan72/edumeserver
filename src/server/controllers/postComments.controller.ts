/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {PostCommentModel} from "../models/postComment.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { postComments_schema } from "../../schemas/postComments.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";



export class PostCommentsController implements Controller{
  public path='/postComments';
  public router= express.Router();
  private postComments = new PostCommentModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(postComments_schema),
                    this.newPostComment);
    this.router.get(this.path+'/byPostId/:postId', authMiddleware, this.getByPostId);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(postComments_schema), this.update);
    return;
  }

  newPostComment  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.postComments.create(request.body).then((respPostCommentDTO) => {
        if (respPostCommentDTO) {
            response.send(respPostCommentDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.postComments.findById(request.params.postId).then((respPostCommentDTO) => {
      if (respPostCommentDTO) {
        response.send(respPostCommentDTO.data);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.postComments.updateById(request.params.id, request.body).then((respPostCommentDTO) => {
      if (respPostCommentDTO) {
        response.send(respPostCommentDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getByPostId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.postComments.findByPostId(request.params.postId).then((respPostCommentDTOArray) => {
      if (respPostCommentDTOArray) {
        response.send(respPostCommentDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

}
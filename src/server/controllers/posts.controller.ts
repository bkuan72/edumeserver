/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {PostModel} from "../models/post.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import { posts_schema } from "../../schemas/posts.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import { PostDTO } from "../../dtos/posts.DTO";

export class PostsController implements Controller{
  public path='/posts';
  public router= express.Router();
  private posts = new PostModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(posts_schema),
                    this.newPost);
    this.router.get(this.path+'/profile-timeline/:userId/:offSetDays', authMiddleware, this.getTimeline);
    this.router.get(this.path+'/byUserId/:userId/:offSetDays', authMiddleware, this.getPostByUserId);
    this.router.get(this.path+'/byPostId/:postId', authMiddleware, this.findById);
    this.router.put(this.path+'/likes/:postId', authMiddleware, this.updateLiked);
    this.router.put(this.path+'/share/:postId', authMiddleware, this.updateShared);
    this.router.patch(this.path+'/:postId', authMiddleware, validationUpdateMiddleware(posts_schema), this.update);
    return;
  }

  newPost  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.posts.create(request.body).then((respPostDTO) => {
        if (respPostDTO) {
            response.send(respPostDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.posts.findById(request.params.postId).then((respPostDTO) => {
      if (respPostDTO) {
        response.send(respPostDTO.data);
      } else {
        next(new DataNotFoundException(request.params.postId))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.posts.updateById(request.params.postId, request.body).then((respPostDTO) => {
      if (respPostDTO) {
        response.send(respPostDTO);
      } else {
        next(new DataNotFoundException(request.params.postId))
      }
    })
  }

  getTimeline  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.posts.findForUserNFriends(request.params.userId, request.params.offSetDays).then((respPostDTO: PostDTO[]) => {
      if (respPostDTO) {
        response.send(respPostDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }

  getPostByUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.posts.findByUserId(request.params.userId, request.params.offSetDays).then((respPostDTO: PostDTO[]) => {
      if (respPostDTO) {
        response.send(respPostDTO);
      } else {
        next(new DataNotFoundException(request.params.postId))
      }
    })
  }
  updateLiked  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.posts.incrementLikesById(request.params.postId).then((respPostDTO) => {
      if (respPostDTO) {
        response.send(respPostDTO);
      } else {
        next(new DataNotFoundException(request.params.postId))
      }
    })
  }
  updateShared  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.posts.incrementShareById(request.params.postId).then((respPostDTO) => {
      if (respPostDTO) {
        response.send(respPostDTO);
      } else {
        next(new DataNotFoundException(request.params.postId))
      }
    })
  }
}
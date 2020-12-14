/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {PostArticleModel} from "../models/postArticle.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { postArticles_schema } from "../../schemas/postArticles.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";



export class PostArticlesController implements Controller{
  public path='/postArticles';
  public router= express.Router();
  private postArticles = new PostArticleModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(postArticles_schema),
                    this.newPostArticle);
    this.router.get(this.path+'/byPostId/:postId', authMiddleware, this.getByPostId);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(postArticles_schema), this.update);
    return;
  }

  newPostArticle  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.postArticles.create(request.body).then((respPostArticleDTO) => {
        if (respPostArticleDTO) {
            response.send(respPostArticleDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.postArticles.findById(request.params.id).then((respPostArticleDTO) => {
      if (respPostArticleDTO) {
        response.send(respPostArticleDTO.data);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.postArticles.updateById(request.params.id, request.body).then((respPostArticleDTO) => {
      if (respPostArticleDTO) {
        response.send(respPostArticleDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getByPostId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.postArticles.findByPostId(request.params.postId).then((respPostArticleDTOArray) => {
      if (respPostArticleDTOArray) {
        response.send(respPostArticleDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

}
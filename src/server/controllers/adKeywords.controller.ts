import { AdKeywordDTO, UpdAdKeywordDTO } from '../../dtos/adKeywords.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AdKeywordModel} from "../models/adKeyword.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { adKeywords_schema } from "../../schemas/adKeywords.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";



export class AdKeywordsController implements Controller{
  public path='/adKeywords';
  public router= express.Router();
  private adKeywords = new AdKeywordModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(adKeywords_schema),
                    this.newAdKeyword);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/codesOnly', authMiddleware, this.getCodesOnly);
    this.router.get(this.path+'/byKeywordCode/:keyword', authMiddleware, this.findByKeyword);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(adKeywords_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    this.router.put(this.path+'/delete/:id', authMiddleware, this.delete);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AdKeywordDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAdKeywordDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(adKeywords_schema);
  }

  newAdKeyword  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.adKeywords.create(request.body).then((respAdKeywordDTO) => {
        if (respAdKeywordDTO) {
            response.send(respAdKeywordDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findByKeyword  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adKeywords.find({side_code: this.siteCode,
                            adKeyword_code: request.params.keyword}).then((respAdKeywordDTOArray) => {
      if (respAdKeywordDTOArray) {
        response.send(respAdKeywordDTOArray);
      } else {
        next(new DataNotFoundException(request.params.keyword))
      }
    })
  }

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adKeywords.findById(request.params.id).then((respAdKeywordDTO) => {
      if (respAdKeywordDTO) {
        response.send(respAdKeywordDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adKeywords.getAll().then((respAdKeywordDTOArray) => {
      if (respAdKeywordDTOArray) {
        response.send(respAdKeywordDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  getCodesOnly  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adKeywords.getCodesOnly().then((respAdKeywordDTOArray) => {
      if (respAdKeywordDTOArray) {
        response.send(respAdKeywordDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adKeywords.updateById(request.params.id, request.body).then((respAdKeywordDTO) => {
      if (respAdKeywordDTO) {
        response.send(respAdKeywordDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  delete  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adKeywords.remove(request.params.id).then((respAdKeywordDTO) => {
      if (respAdKeywordDTO) {
        response.send(respAdKeywordDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }
}
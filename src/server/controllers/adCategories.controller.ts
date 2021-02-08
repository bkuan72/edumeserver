import { AdCategoryDTO, UpdAdCategoryDTO } from '../../dtos/AdCategories.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AdCategoryModel} from "../models/adCategory.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { adCategories_schema } from "../../schemas/adCategories.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";



export class AdCategoriesController implements Controller{
  public path='/adCategories';
  public router= express.Router();
  private adCategories = new AdCategoryModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(adCategories_schema),
                    this.newAdCategory);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(adCategories_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', adminAuthMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AdCategoryDTO();
    response.send(dto.data);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAdCategoryDTO();
    response.send(dto.data);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(adCategories_schema);
  }

  newAdCategory  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.adCategories.create(request.body).then((respAdCategoryDTO) => {
        if (respAdCategoryDTO) {
            response.send(respAdCategoryDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adCategories.findById(request.params.id).then((respAdCategoryDTO) => {
      if (respAdCategoryDTO) {
        response.send(respAdCategoryDTO.data);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adCategories.getAll().then((respAdCategoryDTOArray) => {
      if (respAdCategoryDTOArray) {
        response.send(respAdCategoryDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.adCategories.updateById(request.params.id, request.body).then((respAdCategoryDTO) => {
      if (respAdCategoryDTO) {
        response.send(respAdCategoryDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }
}
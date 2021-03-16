import { FilterIfc } from './../models/advertisement.model';
import { AdvertisementDTO, UpdAdvertisementDTO } from './../../dtos/advertisements.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AdvertisementModel} from "../models/advertisement.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { advertisements_schema } from "../../schemas/advertisements.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from '../../middleware/admin.auth.middleware';

export class AdvertisementsController implements Controller{
  public path='/advertisements';
  public router= express.Router();
  private advertisements = new AdvertisementModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(advertisements_schema),
                    this.newAdvertisement);
    this.router.get(this.path, this.getAll);
    this.router.get(this.path+'/byAdvertisementId/:advertisementId', authMiddleware, this.findById);
    this.router.patch(this.path+'/:advertisementId', authMiddleware, validationUpdateMiddleware(advertisements_schema), this.update);
    this.router.get(this.path+'/search/:searchStr', this.searchAdvertisement);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    this.router.get(this.path+'/filterDTO', adminAuthMiddleware, this.filterDTO);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AdvertisementDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAdvertisementDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(advertisements_schema);
  }
  filterDTO  = (request: express.Request, response: express.Response) => {
    const dto: FilterIfc = {
      categories: ['category1', 'category2'],
      age_groups: ['age1','age2'],
      keywords:   ['word1','word2','word3'],
      date_range: ['start date','end date'],
      date_array: ['date1', 'date2', 'date3'],
      price_range: [0, 1],
      locations: ['city','country', 'post_code']
    }
    response.send(dto);
  }

  newAdvertisement  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.advertisements.create(request.body).then((respAdvertisementDTO) => {
        if (respAdvertisementDTO) {
            response.send(respAdvertisementDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.advertisements.findById(request.params.advertisementId).then((respAdvertisementDTO) => {
      if (respAdvertisementDTO) {
        response.send(respAdvertisementDTO);
      } else {
        next(new DataNotFoundException(request.params.advertisementId))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.advertisements.getAll().then((respAdvertisementDTOArray) => {
      if (respAdvertisementDTOArray) {
        response.send(respAdvertisementDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.advertisements.updateById(request.params.advertisementId, request.body).then((respAdvertisementDTO) => {
      if (respAdvertisementDTO) {
        response.send(respAdvertisementDTO);
      } else {
        next(new DataNotFoundException(request.params.advertisementId))
      }
    })
  }
  private searchAdvertisement = async (request: express.Request, response: express.Response) => {

    const searchResult = await this.advertisements.findKeyword(this.siteCode,
        request.params.searchStr,
        request.body
      );
      if (searchResult === undefined) {
        response.send([]);
      } else {
        response.send(searchResult);
      }
  }
}
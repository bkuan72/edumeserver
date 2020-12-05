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
    return;
  }

  newAdvertisement  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.advertisements.create(request.body).then((respAdvertisementDTO) => {
        if (respAdvertisementDTO) {
            response.send(respAdvertisementDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.advertisements.findById(request.params.advertisementId).then((respAdvertisementDTO) => {
      if (respAdvertisementDTO) {
        response.send(respAdvertisementDTO.data);
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
        request.params.searchStr
      );
      if (searchResult === undefined) {
        response.send([]);
      } else {
        response.send(searchResult);
      }
  }
}
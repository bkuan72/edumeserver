/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {PropertyModel} from "../models/property.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { properties_schema } from "../../schemas/properties.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import { PropertyDTO, UpdPropertyDTO } from "../../dtos/properties.DTO";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";



export class PropertiesController implements Controller{
  public path='/properties';
  public router= express.Router();
  private properties = new PropertyModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(properties_schema),
                    this.newProperty);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byId/:id',  authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(properties_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }
  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new PropertyDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdPropertyDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(properties_schema);
  }

  newProperty  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.properties.create(request.body).then((respPropertyDTO) => {
        if (respPropertyDTO) {
            response.send(respPropertyDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.properties.findById(request.params.id).then((respPropertyDTO) => {
      if (respPropertyDTO) {
        response.send(respPropertyDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.properties.getAll().then((respPropertyDTOArray) => {
      if (respPropertyDTOArray) {
        response.send(respPropertyDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.properties.updateById(request.params.id, request.body).then((respPropertyDTO) => {
      if (respPropertyDTO) {
        response.send(respPropertyDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }
}
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {LogModel} from "../models/log.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { logs_schema } from "../../schemas/logs.schema";
// import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";

export class LogsController implements Controller{
  public path='/logs';
  public router= express.Router();
  private logs = new LogModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path,
                   validationMiddleware(logs_schema),
                    this.newLog);
    this.router.get(this.path, adminAuthMiddleware, this.getAll);
    this.router.get(this.path+'/byLogDate/:logDate', adminAuthMiddleware, this.findByLogDate);
    // this.router.patch(this.path+'/:logId', authMiddleware, validationUpdateMiddleware(logs_schema), this.update);
    return;
  }

  newLog  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.logs.create(request.body).then((respLogDTO) => {
        if (respLogDTO) {
            response.send(respLogDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findByLogDate  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.logs.findById(request.params.logDate).then((respLogDTO) => {
      if (respLogDTO) {
        response.send(respLogDTO);
      } else {
        next(new DataNotFoundException(request.params.logId))
      }
    })
  }

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.logs.findById(request.params.logId).then((respLogDTO) => {
      if (respLogDTO) {
        response.send(respLogDTO);
      } else {
        next(new DataNotFoundException(request.params.logId))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.logs.getAll().then((respLogDTOArray) => {
      if (respLogDTOArray) {
        response.send(respLogDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.logs.updateById(request.params.logId, request.body).then((respLogDTO) => {
      if (respLogDTO) {
        response.send(respLogDTO);
      } else {
        next(new DataNotFoundException(request.params.logId))
      }
    })
  }
}
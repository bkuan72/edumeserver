/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {TokenModel} from "../models/token.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";
import SysEnv from "../../modules/SysEnv";
import { blacklist_tokens_schema_table } from "../../schemas/tokens.schema";



export class BlacklistController implements Controller{
  public path='/blacklist';
  public router= express.Router();
  private tokens = new TokenModel(blacklist_tokens_schema_table);
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, adminAuthMiddleware, this.getAll);
    this.router.get(this.path+'/byId/:id', adminAuthMiddleware, this.findById);
    return;
  }


  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.tokens.findById(request.params.id).then((respTokenDTO) => {
      if (respTokenDTO) {
        response.send(respTokenDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.tokens.getAll().then((respTokenDTOArray) => {
      if (respTokenDTOArray) {
        response.send(respTokenDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }
}
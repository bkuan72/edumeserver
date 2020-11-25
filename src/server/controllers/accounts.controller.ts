/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AccountModel} from "../models/account.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { accounts_schema } from "../../schemas/accounts.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import cors = require('cors');

export class AccountsController implements Controller{
  public path='/accounts';
  public router= express.Router();
  private accounts = new AccountModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    cors(),
                    authMiddleware,
                    validationMiddleware(accounts_schema),
                    this.newAccount);
    this.router.get(this.path, cors(), authMiddleware, this.getAll);
    this.router.get(this.path+'/byAccountId/:accountId',  cors(), authMiddleware, this.findById);
    this.router.patch(this.path+'/:accountId', cors(), authMiddleware, validationUpdateMiddleware(accounts_schema), this.update);
    return;
  }

  newAccount  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.accounts.create(request.body).then((respAccountDTO) => {
        if (respAccountDTO) {
            response.send(respAccountDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accounts.findById(request.params.accountId).then((respAccountDTO) => {
      if (respAccountDTO) {
        response.send(respAccountDTO.data);
      } else {
        next(new DataNotFoundException(request.params.accountId))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accounts.getAll().then((respAccountDTOArray) => {
      if (respAccountDTOArray) {
        response.send(respAccountDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accounts.updateById(request.params.accountId, request.body).then((respAccountDTO) => {
      if (respAccountDTO) {
        response.send(respAccountDTO);
      } else {
        next(new DataNotFoundException(request.params.accountId))
      }
    })
  }
}
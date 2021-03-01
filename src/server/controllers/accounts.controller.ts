import { AccountDTO, UpdAccountDTO } from './../../dtos/accounts.DTO';
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
import adminAuthMiddleware from '../../middleware/admin.auth.middleware';

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

    this.router.post(this.path+'/normal',
                    authMiddleware,
                    validationMiddleware(accounts_schema),
                    this.newNormalAccount);
    this.router.post(this.path+'/service',
                      authMiddleware,
                      validationMiddleware(accounts_schema),
                      this.newServiceAccount);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byUserId/:userId', authMiddleware, this.findByUserId);
    this.router.get(this.path+'/byAccountId/:accountId', authMiddleware, this.findById);
    this.router.patch(this.path+'/byAccountId/:accountId', authMiddleware, validationUpdateMiddleware(accounts_schema), this.update);
    this.router.put(this.path+'/avatar/byAccountId/:accountId', authMiddleware, validationUpdateMiddleware(accounts_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AccountDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAccountDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(accounts_schema);
  }

  newServiceAccount  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.accounts.createServiceAccount(request.body).then((respAccountDTO) => {
        if (respAccountDTO) {
            response.send(respAccountDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };
  newNormalAccount  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.accounts.createNormalAccount(request.body).then((respAccountDTO) => {
        if (respAccountDTO) {
            response.send(respAccountDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findByUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accounts.find({
      user_id: request.params.userId
    }).then((respAccountDTO) => {
      if (respAccountDTO) {
        response.send(respAccountDTO);
      } else {
        next(new DataNotFoundException(request.params.accountId))
      }
    })
  }

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accounts.findById(request.params.accountId).then((respAccountDTO) => {
      if (respAccountDTO) {
        response.send(respAccountDTO);
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
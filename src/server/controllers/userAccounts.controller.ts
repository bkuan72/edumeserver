import { UserAccountsData } from './../../schemas/userAccounts.schema';
import { UpdUserAccountsDTO, UserAccountDataDTO } from './../../dtos/userAccounts.DTO';
import { CommonFn } from './../../modules/CommonFnModule';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { userAccounts_schema } from "../../schemas/userAccounts.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationUserAccountMiddleware from "../../middleware/validate.userAccount.middleware";
import validationUserAccountRegistrationMiddleware from "../../middleware/validate.userAccount.registration.middleware";
import { UserAccountsDTO } from "../../dtos/userAccounts.DTO";

import UserAccountAlreadyExistsException from "../../exceptions/UserAccountAlreadyExistException";
import DbCreatingNewUserAccountException from "../../exceptions/DbCreatingNewUserAccountException";
import SysEnv from "../../modules/SysEnv";
import UserAccountModel from '../models/userAccount.model';
import adminAuthMiddleware from '../../middleware/admin.auth.middleware';



export class UserAccountsController implements Controller{
  public path='/userAccounts';
  public router= express.Router();
  private userAccounts = new UserAccountModel();
  private siteCode = '';

  constructor() {
    this.siteCode = SysEnv.SITE_CODE;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationUserAccountRegistrationMiddleware(userAccounts_schema),
                    validationUserAccountMiddleware(),
                    this.create);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byUserId/:userId', authMiddleware, this.findByUserId);
    this.router.get(this.path+'/byUserAccountId/:userAccountId', authMiddleware, this.findById);
    this.router.patch(this.path+'/:userAccountId',
                        authMiddleware,
                        validationUpdateMiddleware(userAccounts_schema),
                        validationUserAccountMiddleware(),
                         this.update);
    this.router.get(this.path+'/byUserIdAccountId/:userId/:accountId', authMiddleware, this.findByUserIdAccountId);
    this.router.get(this.path+'/userAccountDTO', adminAuthMiddleware, this.apiUserAccountDTO);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiUserAccountDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UserAccountDataDTO();
    response.send(dto);
  }
  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UserAccountsDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdUserAccountsDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(userAccounts_schema);
  }


  private create = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userAccount = new UserAccountsDTO(request.body) as UserAccountsData;
    userAccount.site_code = this.siteCode;
    const accounts = await this.userAccounts.find({
      site_code: this.siteCode,
      user_id: userAccount.user_id,
      account_id: userAccount.account_id
     })
    if (
      accounts.length > 0
    ) {
      next(new UserAccountAlreadyExistsException(userAccount.user_id, userAccount.account_id));
    } else {
      userAccount.site_code = this.siteCode;
      const newUserAccount = await this.userAccounts.create(userAccount);
      if (newUserAccount) {
        response.send(newUserAccount);
      } else {
        next(new DbCreatingNewUserAccountException(userAccount.user_id, userAccount.account_id));
      }
    }
  }

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userAccounts.findById(request.params.userAccountId).then((respUserAccountsDTO) => {
      if (respUserAccountsDTO) {
        response.send(respUserAccountsDTO);
      } else {
        next(new DataNotFoundException(request.params.userAccountId))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userAccounts.getAll().then((respUserAccountsDTOArray) => {
      if (respUserAccountsDTOArray) {
        response.send(respUserAccountsDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userAccounts.updateById(request.params.userAccountId, request.body).then((respUserAccountsDTO) => {
      if (respUserAccountsDTO) {
        response.send(respUserAccountsDTO);
      } else {
        next(new DataNotFoundException(request.params.userAccountId))
      }
    })
  }

  findByUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userAccounts.getUserAccounts(this.siteCode, request.params.userId, 'OK').then((respUserAccountsDTO) => {
      if (respUserAccountsDTO) {
        response.send(respUserAccountsDTO);
      } else {
        next(new DataNotFoundException(request.params.userAccountId))
      }
    })
  }

  findByUserIdAccountId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.userAccounts.find({
      account_id: request.params.accountId,
      user_id: request.params.userId,
      status: 'OK'
    }).then((respUserAccountsDTO) => {
      if (respUserAccountsDTO) {
        response.send(respUserAccountsDTO);
      } else {
        next(new DataNotFoundException(request.params.userAccountId))
      }
    })
  }
}
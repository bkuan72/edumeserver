/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AccountModel} from "../models/account.model";
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



export class UserAccountsController implements Controller{
  public path='/userAccounts';
  public router= express.Router();
  private userAccounts = new AccountModel();
  private siteCode = '';

  constructor() {
    this.siteCode = SysEnv.SITE_CODE;
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationUserAccountRegistrationMiddleware(userAccounts_schema),
                    validationUserAccountMiddleware(),
                    this.registration);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byUserAccountId/:userAccountId', authMiddleware, this.findById);
    this.router.patch(this.path+'/:userAccountId',
                        authMiddleware,
                        validationUpdateMiddleware(userAccounts_schema),
                        validationUserAccountMiddleware(),
                         this.update);
    return;
  }


  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userAccount = new UserAccountsDTO(request.body);
    userAccount.data.site_code = this.siteCode;
    if (
      await this.userAccounts.find({
        site_code: this.siteCode,
        user_id: userAccount.data.user_id,
        account_id: userAccount.data.account_id
       })
    ) {
      next(new UserAccountAlreadyExistsException(userAccount.data.user_id, userAccount.data.account_id));
    } else {
      userAccount.data.site_code = this.siteCode;
      const newUserAccount = await this.userAccounts.create(userAccount);
      if (newUserAccount) {
        response.send(newUserAccount.data);
      } else {
        next(new DbCreatingNewUserAccountException(userAccount.data.user_id, userAccount.data.account_id));
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
}
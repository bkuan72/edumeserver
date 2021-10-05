import { AccountDTO, UpdAccountDTO, AboutAccountDTO } from './../../dtos/accounts.DTO';
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
import CommonFn from '../../modules/CommonFnModule';

export class AccountsController implements Controller{
  public path='/accounts';
  public router= express.Router();
  private accounts = new AccountModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.initializeRoutes();
  }

  public initializeRoutes() {

    this.router.post(this.path+'/normal',
                    authMiddleware,
                    validationMiddleware(accounts_schema),
                    this.newNormalAccount);
    this.router.post(this.path+'/service',
                      authMiddleware,
                      validationMiddleware(accounts_schema),
                      this.newServiceAccount);
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/basicInfo/byAccountId/:accountId', this.getBasicAccountInfo);
    this.router.get(this.path+'/profile-about/byAccountId/:accountId', authMiddleware, this.getAbout);
    this.router.get(this.path+'/byAccountId/:accountId', authMiddleware, this.findById);
    this.router.patch(this.path+'/byAccountId/:accountId', authMiddleware, validationUpdateMiddleware(accounts_schema), this.update);
    this.router.put(this.path+'/avatar/byAccountId/:accountId', authMiddleware, validationUpdateMiddleware(accounts_schema), this.update);
    this.router.get(this.path+'/DTO', authMiddleware, this.apiDTO);
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
      .catch((err) => {
        throw(err);
      });
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

  getAbout  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accounts.findById(request.params.accountId).then((respAccountDTO) => {
      if (respAccountDTO) {
        const aboutDTO = new AboutAccountDTO();
        aboutDTO.general.account_name = respAccountDTO?.account_name;
        aboutDTO.general.about = respAccountDTO?.about_me;
        if (!CommonFn.isEmpty(respAccountDTO?.city)) {
          aboutDTO.general.locations.push(respAccountDTO?.city);
        }
        if (!CommonFn.isEmpty(respAccountDTO?.country)) {
         aboutDTO.general.locations.push(respAccountDTO?.country);
        }
        aboutDTO.contact.address = respAccountDTO?.address;
        if (!CommonFn.isEmpty(respAccountDTO?.phone_no)) {
          aboutDTO.contact.tel.push(respAccountDTO?.phone_no);
        }
        if (!CommonFn.isEmpty(respAccountDTO?.mobile_no)) {
          aboutDTO.contact.tel.push(respAccountDTO?.mobile_no);
        }
        if (!CommonFn.isEmpty(respAccountDTO?.website)) {
          aboutDTO.contact.websites.push(respAccountDTO?.website);
        }
        if (!CommonFn.isEmpty(respAccountDTO?.email)) {
          aboutDTO.contact.emails.push(respAccountDTO?.email);
        }

        //aboutDTO.friends // TODO need to implement friends api
        //aboutDTO.groups // TODO need to implement groups api
        response.send(aboutDTO);
      } else {
        next(new DataNotFoundException(request.params.accountId))
      }
    })
  }

  getBasicAccountInfo  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accounts.findById(request.params.accountId)
    .then((respAccountDTO) => {
      if (respAccountDTO) {
        response.send({
          id: respAccountDTO.id,
          user_name: respAccountDTO.account_name,          
          account_name: respAccountDTO.account_name,
          avatar: respAccountDTO.avatar,
          allow_promo: respAccountDTO.allow_promo,
          allow_friends: respAccountDTO.allow_friends,
          allow_notification: respAccountDTO.allow_notification,
          allow_msg: respAccountDTO.allow_msg,
          allow_follows: respAccountDTO.allow_follows,
          public: respAccountDTO.public
        });
      } else {
        next(new DataNotFoundException(request.params.accountId))
      }
    });
  }
}
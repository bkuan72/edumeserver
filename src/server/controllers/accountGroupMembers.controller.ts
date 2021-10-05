/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {AccountGroupMemberModel} from "../models/accountGroupMember.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import { accountGroupMembers_schema } from "../../schemas/accountGroupMembers.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import { AccountGroupMemberDTO, UpdAccountGroupMemberDTO } from "../../dtos/accountGroupMembers.DTO";
import NoDataException from "../../exceptions/NoDataExceptions";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";

export class AccountGroupMembersController implements Controller{
  public path='/accountGroupMembers';
  public router= express.Router();
  private accountGroupMembers = new AccountGroupMemberModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.initializeRoutes();
  }



  public initializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(accountGroupMembers_schema),
                    this.newAccountGroupMember);
    this.router.get(this.path+'/accountGroupMemberList/byAccountId/:accountId', authMiddleware, this.getAccountGroupMemberListByAccountId);
    this.router.get(this.path+'/contactList/byAccountId/:accountId', authMiddleware, this.getContactListByAccountId);
    this.router.get(this.path+'/byAccountGroupMemberId/:accountGroupMemberId', authMiddleware, this.findById);
    this.router.get(this.path+'/accountMember/:account_id/:user_id', authMiddleware, this.getAccountMemberData);
    this.router.get(this.path+'/areAccountMembers/:account_id/:user_id', authMiddleware, this.areAccountMembers);
    this.router.get(this.path+'/isBlockedByAccount/:account_id/:user_id', authMiddleware, this.isBlockedByAccount);
    this.router.get(this.path+'/isBlockedByGroup/:group_id/:user_id', authMiddleware, this.isBlockedByGroup);
    this.router.patch(this.path+'/:accountGroupMemberId', authMiddleware, validationUpdateMiddleware(accountGroupMembers_schema), this.update);
    this.router.patch(this.path+'/toggleStar/:id', authMiddleware, this.toggleContactStar);
    this.router.patch(this.path+'/incrFrequency/:accountGroupMemberId', authMiddleware, this.incrementFrequencyById);
    this.router.patch(this.path+'/remove/:id', authMiddleware, this.removeContact);

    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new AccountGroupMemberDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdAccountGroupMemberDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(accountGroupMembers_schema);
  }

  newAccountGroupMember  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.accountGroupMembers.createAccountGroupMember(request.body).then((respAccountGroupMemberDTO) => {
        if (respAccountGroupMemberDTO) {
            response.send(respAccountGroupMemberDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
      .catch((err) => {
        throw(err);
      });
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.findById(request.params.accountGroupMemberId).then((respAccountGroupMemberDTO) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  removeContact  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.remove(request.params.id).then((respAccountGroupMemberDTO) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.updateById(request.params.accountGroupMemberId, request.body).then((respAccountGroupMemberDTO) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  toggleContactStar  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.toggleContactStar(request.params.id).then((respAccountGroupMemberDTO) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  incrementFrequencyById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.incrementFrequencyById(request.params.accountGroupMemberId).then((respAccountGroupMemberDTO) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }
  getAccountGroupMemberListByAccountId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.getAccountGroupMemberList(request.params.accountId).then((respAccountGroupMemberDTO: AccountGroupMemberDTO[]) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new NoDataException())
      }
    })
    .catch((err) => {
      throw(err);
    });
  }
  getContactListByAccountId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.getContactList(request.params.accountId).then((respAccountGroupMemberDTO: AccountGroupMemberDTO[]) => {
      if (respAccountGroupMemberDTO) {
        response.send(respAccountGroupMemberDTO);
      } else {
        next(new NoDataException())
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  areAccountMembers  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.areAccountMembers(request.params).then((respAccountGroupMember) => {
      if (respAccountGroupMember) {
        if (respAccountGroupMember.accountGroupMembers) {
          this.accountGroupMembers.isBlockedByAccount(request.param).then((blockResp) => {
            respAccountGroupMember.blocked = blockResp.blocked;
            response.send(respAccountGroupMember);
          })
          .catch(() => {
            response.send(respAccountGroupMember);
          })
        } else {
          response.send(respAccountGroupMember);
        }
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  getAccountMemberData  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.getAccountMemberData(request.params).then((respAccountGroupMember) => {
      if (respAccountGroupMember) {
        response.send(respAccountGroupMember);
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  isBlockedByAccount  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.isBlockedByAccount(request.params).then((respAccountGroupMember) => {
      if (respAccountGroupMember) {
        response.send(respAccountGroupMember);
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  isBlockedByGroup  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.accountGroupMembers.isBlockedByGroup(request.params).then((respAccountGroupMember) => {
      if (respAccountGroupMember) {
        response.send(respAccountGroupMember);
      } else {
        next(new DataNotFoundException(request.params.accountGroupMemberId))
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

}
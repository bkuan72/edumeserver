import { MemberSecurityDTO, UpdMemberSecurityDTO } from './../../dtos/memberSecurities.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {MemberSecurityModel} from "../models/memberSecurity.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { member_security_schema } from "../../schemas/memberSecurities.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";



export class MemberSecuritiesController implements Controller{
  public path='/memberSecurities';
  public router= express.Router();
  private memberSecurities = new MemberSecurityModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(member_security_schema),
                    this.newMemberSecurity);
    // this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byMemberId/:memberId', authMiddleware, this.findByMemberId);
    this.router.get(this.path+'/byId/:id', authMiddleware, this.findById);
    this.router.patch(this.path+'/:id', authMiddleware, validationUpdateMiddleware(member_security_schema), this.update);
    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new MemberSecurityDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdMemberSecurityDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(member_security_schema);
  }

  newMemberSecurity  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.memberSecurities.create(request.body).then((respMemberSecurityDTO) => {
        if (respMemberSecurityDTO) {
            response.send(respMemberSecurityDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.memberSecurities.findById(request.params.id).then((respMemberSecurityDTO) => {
      if (respMemberSecurityDTO) {
        response.send(respMemberSecurityDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }

  findByMemberId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.memberSecurities.findByMemberId(request.params.memberId).then((respMemberSecurityDTO) => {
      if (respMemberSecurityDTO) {
        response.send(respMemberSecurityDTO);
      } else {
        next(new DataNotFoundException(request.params.memberId))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.memberSecurities.getAll().then((respMemberSecurityDTOArray) => {
      if (respMemberSecurityDTOArray) {
        response.send(respMemberSecurityDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.memberSecurities.updateById(request.params.id, request.body).then((respMemberSecurityDTO) => {
      if (respMemberSecurityDTO) {
        response.send(respMemberSecurityDTO);
      } else {
        next(new DataNotFoundException(request.params.id))
      }
    })
  }
}
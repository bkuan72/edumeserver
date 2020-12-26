import { CommonFn } from './../../modules/CommonFnModule';
import { AboutDTO } from './../../dtos/about.DTO';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {UserModel} from "../models/user.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import { ResponseUserDTO } from "../../dtos/ResponseUserDTO";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import NoDataException from "../../exceptions/NoDataExceptions";
import { users_schema } from "../../schemas/users.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";



export class UsersController implements Controller{
  public path='/users';
  public router= express.Router();
  private users = new UserModel();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/basicInfo/byUserId/:userId', this.getBasicUserInfo);
    this.router.get(this.path+'/byUserId/:userId', authMiddleware, this.findById);
    this.router.get(this.path+'/byEmail/:email', authMiddleware, this.findById);
    this.router.patch(this.path+'/:userId', authMiddleware, validationUpdateMiddleware(users_schema), this.update);
    this.router.get(this.path+'/profile-about/byUserId/:userId', authMiddleware, this.getAbout);
    return;
  }

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.users.findById(request.params.userId).then((respUserDTO) => {
      if (respUserDTO) {
        response.send(respUserDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }
  findByEmail  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.users.findByEmail(request.params.email).then((respUserDTO) => {
      if (respUserDTO) {
        response.send(respUserDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }

  getAll  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.users.getAll().then((respUserDTOArray) => {
      if (respUserDTOArray) {
        response.send(respUserDTOArray);
      } else {
        next(new NoDataException())
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.users.updateById(request.params.userId, request.body).then((respUserDTO) => {
      if (respUserDTO) {
        response.send(respUserDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }

  getAbout  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.users.findById(request.params.userId).then((respUserDTO) => {
      if (respUserDTO) {
        const aboutDTO = new AboutDTO();
        aboutDTO.general.gender = respUserDTO?.data.gender;
        aboutDTO.general.birthday = respUserDTO?.data.birthday;
        if (!CommonFn.isEmpty(respUserDTO?.data.city)) {
          aboutDTO.general.locations.push(respUserDTO?.data.city);
        }
        if (!CommonFn.isEmpty(respUserDTO?.data.country)) {
         aboutDTO.general.locations.push(respUserDTO?.data.country);
        }
        aboutDTO.contact.address = respUserDTO?.data.address;
        if (!CommonFn.isEmpty(respUserDTO?.data.phone_no)) {
          aboutDTO.contact.tel.push(respUserDTO?.data.phone_no);
        }
        if (!CommonFn.isEmpty(respUserDTO?.data.mobile_no)) {
          aboutDTO.contact.tel.push(respUserDTO?.data.mobile_no);
        }
        if (!CommonFn.isEmpty(respUserDTO?.data.website)) {
          aboutDTO.contact.websites.push(respUserDTO?.data.website);
        }
        if (!CommonFn.isEmpty(respUserDTO?.data.email)) {
          aboutDTO.contact.emails.push(respUserDTO?.data.email);
        }

        //aboutDTO.friends // TODO need to implement friends api
        //aboutDTO.groups // TODO need to implement groups api
        response.send(aboutDTO);
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    })
  }

  getBasicUserInfo  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.users.findById(request.params.userId)
    .then((respUserDTO) => {
      if (respUserDTO) {
        response.send({
          id: respUserDTO.data.id,
          user_name: respUserDTO.data.user_name,
          avatar: respUserDTO.data.avatar
        });
      } else {
        next(new DataNotFoundException(request.params.userId))
      }
    });
  }
}
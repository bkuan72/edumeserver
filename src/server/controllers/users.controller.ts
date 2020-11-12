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
  private respUserDTO = new ResponseUserDTO();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.get(this.path+'/byUserId/:userId',  authMiddleware, this.findById);
    this.router.patch(this.path+'/:userId', authMiddleware, validationUpdateMiddleware(users_schema), this.update);
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
}
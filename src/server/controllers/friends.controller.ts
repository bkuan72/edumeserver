/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {FriendModel} from "../models/friend.model";
import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import { friends_schema } from "../../schemas/friends.schema";
import validationUpdateMiddleware from "../../middleware/validate.update.dto.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";

import PostDataFailedException from "../../exceptions/PostDataFailedException";
import SysEnv from "../../modules/SysEnv";
import { FriendDTO } from "../../dtos/friends.DTO";
import NoDataException from "../../exceptions/NoDataExceptions";

export class FriendsController implements Controller{
  public path='/friends';
  public router= express.Router();
  private friends = new FriendModel();
  siteCode = SysEnv.SITE_CODE;


  constructor() {
      this.siteCode = SysEnv.SITE_CODE;
      this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path,
                    authMiddleware,
                    validationMiddleware(friends_schema),
                    this.newFriend);
    this.router.get(this.path+'/friendList/byUserId/:userId', authMiddleware, this.getFriendListByUserId);
    this.router.get(this.path+'/byFriendId/:friendId', authMiddleware, this.findById);
    this.router.patch(this.path+'/:friendId', authMiddleware, validationUpdateMiddleware(friends_schema), this.update);
    return;
  }

  newFriend  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.friends.create(request.body).then((respFriendDTO) => {
        if (respFriendDTO) {
            response.send(respFriendDTO.data);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.friends.findById(request.params.friendId).then((respFriendDTO) => {
      if (respFriendDTO) {
        response.send(respFriendDTO.data);
      } else {
        next(new DataNotFoundException(request.params.friendId))
      }
    })
  }

  update  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.friends.updateById(request.params.friendId, request.body).then((respFriendDTO) => {
      if (respFriendDTO) {
        response.send(respFriendDTO);
      } else {
        next(new DataNotFoundException(request.params.friendId))
      }
    })
  }

  getFriendListByUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.friends.getFriendList(request.params.userId).then((respFriendDTO: FriendDTO[]) => {
      if (respFriendDTO) {
        response.send(respFriendDTO);
      } else {
        next(new NoDataException())
      }
    })
  }
}
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
import { FriendDTO, UpdFriendDTO } from "../../dtos/friends.DTO";
import NoDataException from "../../exceptions/NoDataExceptions";
import adminAuthMiddleware from "../../middleware/admin.auth.middleware";

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
    this.router.get(this.path+'/contactList/byUserId/:userId', authMiddleware, this.getContactListByUserId);
    // this.router.get(this.path+'/byUserId/keyword/:userId/:keyword', authMiddleware, this.findByUserIdKeyword);
    this.router.get(this.path+'/byFriendId/:friendId', authMiddleware, this.findById);
    this.router.get(this.path+'/areFriends/:user_id/:friend_id', authMiddleware, this.areFriends);
    this.router.get(this.path+'/isBlockedByFriend/:user_id/:friend_id', authMiddleware, this.isBlockedByFriend);
    this.router.patch(this.path+'/:friendId', authMiddleware, validationUpdateMiddleware(friends_schema), this.update);
    this.router.patch(this.path+'/toggleStar/:id', authMiddleware, this.toggleContactStar);
    this.router.patch(this.path+'/incrFrequency/:friendId', authMiddleware, this.incrementFrequencyById);
    this.router.patch(this.path+'/remove/:id', authMiddleware, this.removeContact);

    this.router.get(this.path+'/DTO', adminAuthMiddleware, this.apiDTO);
    this.router.get(this.path+'/updDTO', authMiddleware, this.apiUpdDTO);
    this.router.get(this.path+'/schema', adminAuthMiddleware, this.apiSchema);
    return;
  }

  apiDTO  = (request: express.Request, response: express.Response) => {
    const dto = new FriendDTO();
    response.send(dto);
  }
  apiUpdDTO  = (request: express.Request, response: express.Response) => {
    const dto = new UpdFriendDTO();
    response.send(dto);
  }
  apiSchema  = (request: express.Request, response: express.Response) => {
    response.send(friends_schema);
  }

  newFriend  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
      this.friends.createFriend(request.body).then((respFriendDTO) => {
        if (respFriendDTO) {
            response.send(respFriendDTO);
          } else {
            next(new PostDataFailedException())
          }
      })
  };

  findById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.friends.findById(request.params.friendId).then((respFriendDTO) => {
      if (respFriendDTO) {
        response.send(respFriendDTO);
      } else {
        next(new DataNotFoundException(request.params.friendId))
      }
    })
  }

  removeContact  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.friends.remove(request.params.id).then((respFriendDTO) => {
      if (respFriendDTO) {
        response.send(respFriendDTO);
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

  toggleContactStar  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.friends.toggleContactStar(request.params.id).then((respFriendDTO) => {
      if (respFriendDTO) {
        response.send(respFriendDTO);
      } else {
        next(new DataNotFoundException(request.params.friendId))
      }
    })
  }

  incrementFrequencyById  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.friends.incrementFrequencyById(request.params.friendId).then((respFriendDTO) => {
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
  getContactListByUserId  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.friends.getContactList(request.params.userId).then((respFriendDTO: FriendDTO[]) => {
      if (respFriendDTO) {
        response.send(respFriendDTO);
      } else {
        next(new NoDataException())
      }
    })
  }

  areFriends  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.friends.areFriends(request.params).then((respFriend) => {
      if (respFriend) {
        if (respFriend.friends) {
          this.friends.isBlockedByFriend(request.param).then((blockResp) => {
            respFriend.blocked = blockResp.blocked;
            response.send(respFriend);
          })
          .catch(() => {
            response.send(respFriend);
          })
        } else {
          response.send(respFriend);
        }
      } else {
        next(new DataNotFoundException(request.params.friendId))
      }
    })
  }

  isBlockedByFriend  = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.friends.isBlockedByFriend(request.params).then((respFriend) => {
      if (respFriend) {
        response.send(respFriend);
      } else {
        next(new DataNotFoundException(request.params.friendId))
      }
    })
  }

}
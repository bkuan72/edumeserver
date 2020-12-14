import { AccountModel } from './../models/account.model';
import { UserAccountModel } from './../models/userAccount.model';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { blacklist_tokens_schema_table, tokens_schema_table } from './../../schemas/tokens.schema';
import Controller from "../../interfaces/controller.interface";
import * as express from 'express';
import jwt = require('jsonwebtoken');
import { users_schema } from "../../schemas/users.schema";
import validationUserRegistrationMiddleware from "../../middleware/validation.user.registration.middleware";
import { loginDTO_schema } from "../../schemas/loginDTO.schema";
import validationMiddleware from "../../middleware/validation.middleware";
import { LoginDTO } from "../../dtos/login.DTO";
import { bcryptCompare } from "../../modules/cryto";
import UserModel from "../models/user.model";
import { CreateUserDTO } from "../../dtos/CreateUserDTO";
import WrongCredentialsException from "../../exceptions/WrongCredentialsException";
import UserWithThatEmailAlreadyExistsException from "../../exceptions/UserWithThatEmailAlreadyExistsException";
import DbCreatingNewUserException from "../../exceptions/DbCreatingUserException";
import { ResponseUserDTO } from "../../dtos/ResponseUserDTO";
import { TokenData } from "../../interfaces/TokenData";
import DataStoredInToken from "../../interfaces/DataStoredInToken";
import { v4 as uuidv4 } from 'uuid';
import { TokenModel } from "../models/token.model";
import { TokenDTO } from "../../dtos/tokens.DTO";
import SysLog from "../../modules/SysLog";
import SysEnv from "../../modules/SysEnv";
import InvalidUserStatusException from "../../exceptions/InvalidUserStatusException";
import WrongAuthenticationTokenException from '../../exceptions/WrongAuthenticationTokenException';
import InvalidAuthenticationTokenException from '../../exceptions/InvalidAuthenticationTokenException';
import ExpiredTokenException from '../../exceptions/ExpiredTokenExceptions';
import authMiddleware from '../../middleware/auth.middleware';
import DTOGenerator from '../../modules/ModelGenerator';
import { getRequestAuthToken } from '../../middleware/getRequestAuthToken';
import AuthenticationTokenMissingException from "../../exceptions/AuthenticationTokenMissingException";


class AuthenticationController implements Controller {
    public path='/auth';
    public router= express.Router();
    private users = new UserModel();
    private userAccounts = new UserAccountModel();
    private accounts = new AccountModel();
    private tokens = new TokenModel(tokens_schema_table);
    private blacklistTokens = new TokenModel(blacklist_tokens_schema_table);
    private siteCode = SysEnv.SITE_CODE;
    private tokenExpireInMin = 60;
    constructor() {
        this.siteCode = SysEnv.SITE_CODE;
        this.tokenExpireInMin = SysEnv.TOKEN_EXP_IN_MIN;
        this.initializeRoutes();
      }
      private initializeRoutes() {
        this.router.post(`${this.path}/logout`, authMiddleware, this.loggingOut);
        this.router.post(`${this.path}/renew/token`, authMiddleware, this.renewAuthCookie);
        this.router.post(`${this.path}/register`, validationUserRegistrationMiddleware(users_schema), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(loginDTO_schema), this.loggingIn);
      }

      private createToken = async (user: ResponseUserDTO): Promise <TokenData> => {
        return new Promise ((resolve) => {
          const generateToken = (adminUser: boolean) => {
            const expiresIn = this.tokenExpireInMin * 60; // convert to millisec
            const timestamp = new Date();
            const dataStoredInToken: DataStoredInToken = {
              user_id: user.data.id,
              uuid: uuidv4(),
              adminUser: adminUser,
              site_code: this.siteCode,
              createTimeStamp: timestamp.toUTCString(),
              expireInMin: expiresIn
            };
            const authorization = jwt.sign(dataStoredInToken, SysEnv.JWT_SECRET, { expiresIn });
            this.tokens.create(dataStoredInToken, authorization).then (() => {
              resolve({
                expiresIn,
                token: authorization,
              });
            });
          }

          this.userAccounts.find({
            site_code: this.siteCode,
            user_id: user.data.id,
            status: 'OK'
          }).then((userAccount) => {
            if (userAccount && userAccount.length > 0) {
              this.accounts.findById(userAccount[0].data.account_id).then((account) => {
                generateToken(account.data.account_type === 'ADMIN');
              })
              .catch(() => {
                generateToken(false);
              })
            } else {
              generateToken(false);
            }
          })
          .catch(() => {
            generateToken(false);
          });



        });
      }

      private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly=true; Max-Age=${tokenData.expiresIn}`;
      }


      private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const user = new CreateUserDTO(request.body);
        const existingUser =  await this.users.find({
                              site_code: this.siteCode,
                              email: user.data.email
                            });
        if (
          existingUser !== undefined &&  existingUser.length > 0
        ) {
          SysLog.error(`User With That Email Already Exists Exception: ${user.data.email}`);
          next(new UserWithThatEmailAlreadyExistsException(user.data.email));
        } else {
          user.data.site_code = this.siteCode;
          const newUser = await this.users.create(user.data);
          if (newUser) {
            const tokenData = await this.createToken(newUser);

            if (SysEnv.CookieAuth()) {
              response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
              response.send(newUser);
            } else {
              const authUser = DTOGenerator.defineProperty(newUser, 'token', tokenData)
              response.send (authUser);
            }
          } else {
            SysLog.error(`DB Creating New User Exception: ${user.data.email}`);
            next(new DbCreatingNewUserException(user.data.email));
          }
        }
      }

      private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData = new LoginDTO(request.body);
        logInData.data.siteCode = this.siteCode;
        const user = await this.users.find({ email: logInData.data.email }, true, true);
        if (user && user.length > 0) {
          const isPasswordMatching = await bcryptCompare(logInData.data.password, user[0].data.password);
          if (isPasswordMatching) {
            if (user[0].data.status === 'ENABLED') {
              user[0].data.password = undefined;
              const tokenData = await this.createToken(user[0]);
              if (SysEnv.CookieAuth()) {
                response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                response.send(user[0]);
              } else {
                const authUser = DTOGenerator.defineProperty(user[0], 'token', tokenData)
                response.send (authUser);
              }
            } else {
              SysLog.error(`Invalid User Status,  Id : ${user[0].data.id}, email: ${user[0].data.email} Status: ${user[0].data.status}`);
              next(new InvalidUserStatusException(user[0]));
            }
          } else {
            SysLog.error(`Wrong Password Exception: ${logInData.data.email}`);
            next(new WrongCredentialsException(logInData.data.email));
          }
        } else {
          SysLog.error(`Cannot Find Email Exception: ${logInData.data.email}`);
          next(new WrongCredentialsException(logInData.data.email));
        }
      }

      private loggingOut = (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const authToken = getRequestAuthToken(request);

        if (authToken) {
          const verificationResponse = jwt.verify(authToken, SysEnv.JWT_SECRET) as DataStoredInToken;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          this.blacklistTokens.create(verificationResponse, authToken).then ((tokenDTO: TokenDTO) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          this.tokens.removeByUuid(verificationResponse.uuid);
            if (SysEnv.CookieAuth()) {
              response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
            }
            response.send ({ status: 'ok'});
          });
        } else {
          next(new AuthenticationTokenMissingException());
        }
      }



      private renewAuthCookie = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const authToken = getRequestAuthToken(request);

        if (authToken) {
          jwt.verify(authToken, SysEnv.JWT_SECRET, async (err: any, verificationResponse: any) => {
            if (err) {
              next(new InvalidAuthenticationTokenException(err));
            } else {
              const id = verificationResponse.user_id;
              const user = await this.users.findById(id);
              if (user) {
                if (user.data.status === 'ENABLED') {
                  if (this.tokens.tokenExpired(verificationResponse.expireInMin,
                    verificationResponse.createTimeStamp)) {
                      SysLog.error('Renew Cookie using Expired Token Used By User Id :', id);
                      next(new ExpiredTokenException(user));
                  } else {
                    this.blacklistTokens.create(verificationResponse, authToken).then(async () => {
                      this.tokens.removeByUuid(verificationResponse.uuid);
                      const tokenData = await this.createToken(user);
                      if (SysEnv.CookieAuth()) {
                        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                        response.send(user);
                      } else {
                        const authUser = DTOGenerator.defineProperty(user, 'token', tokenData)
                        response.send (authUser);
                      }
                    })
                  }
                } else {
                  SysLog.error('Authentication Token used by Invalid User Id :', id);
                  next(new InvalidUserStatusException(user));
                }
              } else {
                SysLog.error('Renew Cookie by Invalid User Id :', id);
                next(new WrongAuthenticationTokenException());
              }
            }
          });
        } else {
          next(new AuthenticationTokenMissingException());
        }
       };
}

export default AuthenticationController;
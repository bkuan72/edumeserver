import { blacklist_tokens_schema_table } from './../../schemas/tokens.schema';
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

class AuthenticationController implements Controller {
    public path='/auth';
    public router= express.Router();
    private users = new UserModel();
    private tokens = new TokenModel();
    private blacklistTokens = new TokenModel(blacklist_tokens_schema_table);
    private siteCode = SysEnv.SITE_CODE;
    private tokenExpireInMin = 60;
    constructor() {
        this.siteCode = SysEnv.SITE_CODE;
        this.tokenExpireInMin = SysEnv.TOKEN_EXP_IN_MIN;
        this.initializeRoutes();
      }
      private initializeRoutes() {
        this.router.post(`${this.path}/logout`, this.loggingOut);
        this.router.post(`${this.path}/register`, validationUserRegistrationMiddleware(users_schema), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(loginDTO_schema), this.loggingIn);
      }

      private createToken = (user: ResponseUserDTO): Promise <TokenData> => {
        return new Promise ((resolve) => {
          const expiresIn = this.tokenExpireInMin * 60; // an hour

          const timestamp = new Date();
          const dataStoredInToken: DataStoredInToken = {
            user_id: user.data.id,
            uuid: uuidv4(),
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
        });
      }

      private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly=true; Max-Age=${tokenData.expiresIn}`;
      }


      private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const user = new CreateUserDTO(request.body);
        if (
          await this.users.find({
            site_code: this.siteCode,
            email: user.data.email
           })
        ) {
          SysLog.error(`User With That Email Already Exists Exception: ${user.data.email}`);
          next(new UserWithThatEmailAlreadyExistsException(user.data.email));
        } else {
          user.data.site_code = this.siteCode;
          const newUser = await this.users.create(user);
          if (newUser) {
            const tokenData = await this.createToken(user);
            response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
            response.send(newUser.data);
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
        if (user) {
          const isPasswordMatching = await bcryptCompare(logInData.data.password, user[0].data.password);
          if (isPasswordMatching) {
            if (user[0].data.status === 'ENABLED') {
              user[0].data.password = undefined;
              const tokenData = await this.createToken(user[0]);
              response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
              response.send(user);
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

      private loggingOut = (request: express.Request, response: express.Response) => {
        const cookies = request.cookies;
        const verificationResponse = jwt.verify(cookies.Authorization, SysEnv.JWT_SECRET) as DataStoredInToken;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.blacklistTokens.create(verificationResponse, cookies.Authorization).then ((tokenDTO: TokenDTO) => {
          response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
          response.send(200);
        });
      }

      // TODO private renewCookie ()
}

export default AuthenticationController;
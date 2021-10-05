import { UserModuleRoleModel } from './../models/userModuleRole.model';
import { UserModuleRoleDataDTO } from './../../dtos/userModuleRoles.DTO';
import { UserData } from './../../schemas/users.schema';
import { CommonFn } from './../../modules/CommonFnModule';
import { ResponseUserDTO, CreateUserDTO } from '../../dtos/user.DTO';
import { UserAccountModel } from './../models/userAccount.model';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  blacklist_tokens_schema_table,
  tokens_schema_table
} from './../../schemas/tokens.schema';
import Controller from '../../interfaces/controller.interface';
import * as express from 'express';
import jwt = require('jsonwebtoken');
import { users_schema } from '../../schemas/users.schema';
import validationUserRegistrationMiddleware from '../../middleware/validation.user.registration.middleware';
import { loginDTO_schema } from '../../schemas/loginDTO.schema';
import validationMiddleware from '../../middleware/validation.middleware';
import { LoginDTO } from '../../dtos/login.DTO';
import { bcryptCompare } from '../../modules/cryto';
import UserModel from '../models/user.model';
import WrongCredentialsException from '../../exceptions/WrongCredentialsException';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import DbCreatingNewUserException from '../../exceptions/DbCreatingUserException';
import { TokenData } from '../../interfaces/TokenData';
import DataStoredInToken from '../../interfaces/DataStoredInToken';
import { v4 as uuidv4 } from 'uuid';
import { TokenModel } from '../models/token.model';
import SysLog from '../../modules/SysLog';
import SysEnv from '../../modules/SysEnv';
import InvalidUserStatusException from '../../exceptions/InvalidUserStatusException';
import WrongAuthenticationTokenException from '../../exceptions/WrongAuthenticationTokenException';
import InvalidAuthenticationTokenException from '../../exceptions/InvalidAuthenticationTokenException';
import ExpiredTokenException from '../../exceptions/ExpiredTokenExceptions';
import authMiddleware from '../../middleware/auth.middleware';
import DTOGenerator from '../../modules/ModelGenerator';
import { getRequestAuthToken } from '../../middleware/getRequestAuthToken';
import AuthenticationTokenMissingException from '../../exceptions/AuthenticationTokenMissingException';
import SysMailer from '../../modules/SysEmailerModule';
import RegistrationKeyException from '../../exceptions/RegistrationKeyException';
import ResetPasswordKeyException from '../../exceptions/ResetPasswordKeyException';
import RegistrationConfirmationException from '../../exceptions/RegistrationConfirmationException';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private users = new UserModel();
  private userModuleRoles = new UserModuleRoleModel();
  private userAccounts = new UserAccountModel();
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
    this.router.post(
      `${this.path}/renew/token`,
      authMiddleware,
      this.renewAuthCookie
    );
    this.router.post(
      `${this.path}/register`,
      validationUserRegistrationMiddleware(users_schema),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(loginDTO_schema),
      this.loggingIn
    );
    this.router.get(
      `${this.path}/confirm/byEmailNRegConfirmKey/:email/:regConfirmKey`,
      this.confirmRegistration
    );
    this.router.get(
      `${this.path}/resetPassword/byEmail/:email`,
      this.setResetPasswordKeyNSendConfirmation
    );
    this.router.get(
      `${this.path}/confirm/byEmailResetPasswordKey/:email/:resetPasswordKey`,
      this.validateResetPasswordKey
    );
    this.router.get(
      `${this.path}/resetPassword/byEmailNresetConfirmKeyNnewPassword/:email/:resetPasswordKey/:newPassword`,
      this.resetPassword
    );
  }

  private createToken = async (user: ResponseUserDTO | UserData): Promise<TokenData> => {
    return new Promise((resolve) => {
      const generateToken = (adminUser: boolean, 
                             devUser: boolean, 
                             bizUser: boolean,
                             userRoles: UserModuleRoleDataDTO[]) => {
        const expiresIn = this.tokenExpireInMin * 60; // convert to seconds
        const timestamp = new Date();
        const dataStoredInToken: DataStoredInToken = {
          user_id: user.id,
          uuid: uuidv4(),
          adminUser: adminUser,
          devUser: devUser,
          bizUser: bizUser,
          site_code: this.siteCode,
          createTimeStamp: timestamp.toUTCString(),
          expiryInSec: expiresIn,
          roles: userRoles
        };
        const authorization = jwt.sign(dataStoredInToken, SysEnv.JWT_SECRET, {
          expiresIn
        });
        this.tokens.createToken(dataStoredInToken, authorization).then(() => {
          resolve({
            expiresIn,
            token: authorization
          });
        });
      };
      this.userModuleRoles.getUserModuleRoles(this.siteCode, user.id).then((userRoles) => {
        this.userAccounts
        .getUserAccountTypes(this.siteCode,
          user.id,
          'OK')
        .then((userAccountTypes) => {
          if (userAccountTypes && userAccountTypes.length > 0) {
            let adminUser = false;
            let devUser = false;
            let bizUser = false;
            userAccountTypes.forEach((accountType) => {
              if (accountType.account_type == 'ADMIN') {
                adminUser = true;
              } else
              if (accountType.account_type == 'DEV') {
                devUser = true;
              } else
              if (accountType.account_type == 'SERVICE') {
                bizUser = true;
              }
            })
            generateToken(adminUser, devUser, bizUser, userRoles);
          } else {
            generateToken(false, false, false, userRoles);
          }
        })
        .catch(() => {
          generateToken(false, false, false, userRoles);
        });
      });
    });
  };

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly=true; Max-Age=${tokenData.expiresIn}`;
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const user = new CreateUserDTO(request.body) as  UserData;
    const existingUser = await this.users.find({
      site_code: this.siteCode,
      email: user.email
    });
    if (existingUser !== undefined && existingUser.length > 0) {
      SysLog.error(
        `User With That Email Already Exists Exception: ${user.email}`
      );
      next(new UserWithThatEmailAlreadyExistsException(user.email));
    } else {
      user.site_code = this.siteCode;
      const newUser = await this.users.create(user);
      if (newUser) {
        const regConfirmKey = uuidv4();
        this.users
          .updateRegConfirmKeyByEmail(newUser.email, regConfirmKey)
          .then(async (respUserDTO: ResponseUserDTO | undefined) => {
            if (respUserDTO) {
              SysMailer.mailRegisterConfirmation(respUserDTO);
            }
            const tokenData = await this.createToken(newUser);

            if (SysEnv.CookieAuth()) {
              response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
              response.send(newUser);
            } else {
              const authUser = DTOGenerator.defineProperty(
                newUser,
                'token',
                tokenData
              );
              response.send(authUser);
            }
          })
          .catch(() => {
            SysLog.error(`DB Creating New User Exception: ${user.email}`);
            next(new DbCreatingNewUserException(user.email));
          });
      } else {
        SysLog.error(`DB Creating New User Exception: ${user.email}`);
        next(new DbCreatingNewUserException(user.email));
      }
    }
  };

  private loggingIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData = new LoginDTO(request.body) as UserData;
    logInData.siteCode = this.siteCode;
    const user = await this.users.find(
      { email: logInData.email },
      true,
      true
    );
    if (user && user.length > 0) {
      const isPasswordMatching = await bcryptCompare(
        logInData.password,
        user[0].password
      );
      if (isPasswordMatching) {
        if (CommonFn.isEmpty(user[0].reg_confirm_key)) {
          if (user[0].status === 'ENABLED') {
            user[0].password = undefined;
            const tokenData = await this.createToken(user[0]);
            if (SysEnv.CookieAuth()) {
              response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
              response.send(user[0]);
            } else {
              const authUser = DTOGenerator.defineProperty(
                user[0],
                'token',
                tokenData
              );
              response.send(authUser);
            }
          } else {
            SysLog.error(
              `Invalid User Status,  Id : ${user[0].id}, email: ${user[0].email} Status: ${user[0].status}`
            );
            next(new InvalidUserStatusException(user[0]));
          }
        } else {
          next(new RegistrationConfirmationException(user[0]));
        }
      } else {
        SysLog.error(`Wrong Password Exception: ${logInData.email}`);
        next(new WrongCredentialsException(logInData.email));
      }
    } else {
      SysLog.error(`Cannot Find Email Exception: ${logInData.email}`);
      next(new WrongCredentialsException(logInData.email));
    }
  };

  private loggingOut = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const authToken = getRequestAuthToken(request);

    if (authToken) {
      const verificationResponse = jwt.verify(
        authToken,
        SysEnv.JWT_SECRET
      ) as DataStoredInToken;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.blacklistTokens.createToken(verificationResponse, authToken).then(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.tokens.removeByUuid(verificationResponse.uuid);
        if (SysEnv.CookieAuth()) {
          response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        }
        response.send({ status: 'ok' });
      });
    } else {
      next(new AuthenticationTokenMissingException());
    }
  };

  private renewAuthCookie = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const authToken = getRequestAuthToken(request);

    if (authToken) {
      jwt.verify(
        authToken,
        SysEnv.JWT_SECRET,
        async (err: any, verificationResponse: any) => {
          if (err) {
            next(new InvalidAuthenticationTokenException(err));
          } else {
            const id = verificationResponse.user_id;
            const user = await this.users.findById(id);
            if (user) {
              if (user.status === 'ENABLED') {
                if (
                  this.tokens.tokenExpired(
                    verificationResponse.expiryInSec,
                    verificationResponse.createTimeStamp
                  )
                ) {
                  SysLog.error(
                    'Renew Cookie using Expired Token Used By User Id :',
                    id
                  );
                  next(new ExpiredTokenException(user));
                } else {
                  // this.blacklistTokens
                  //   .create(verificationResponse, authToken)
                  //   .then(async () => {
                  this.tokens.removeByUuid(verificationResponse.uuid);
                  const tokenData = await this.createToken(user);
                  if (SysEnv.CookieAuth()) {
                    response.setHeader('Set-Cookie', [
                      this.createCookie(tokenData)
                    ]);
                    response.send(user);
                  } else {
                    const authUser = DTOGenerator.defineProperty(
                      user,
                      'token',
                      tokenData
                    );
                    response.send(authUser);
                  }
                  // });
                }
              } else {
                SysLog.error(
                  'Authentication Token used by Invalid User Id :',
                  id
                );
                next(new InvalidUserStatusException(user));
              }
            } else {
              SysLog.error('Renew Cookie by Invalid User Id :', id);
              next(new WrongAuthenticationTokenException());
            }
          }
        }
      );
    } else {
      next(new AuthenticationTokenMissingException());
    }
  };

  private confirmRegistration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { email, regConfirmKey } = request.params;
    const existingUser = await this.users.findByEmail(email);
    if (existingUser) {
      if (existingUser.reg_confirm_key !== regConfirmKey) {
        next(new RegistrationKeyException(email, regConfirmKey));
      } else {
        this.users.updateRegConfirmKeyByEmail(email, '');
        existingUser.reg_confirm_key = '';
        response.send(existingUser);
      }
    } else {
      next(new RegistrationKeyException(email, regConfirmKey));
    }
  };

  private setResetPasswordKeyNSendConfirmation = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { email } = request.params;
    const existingUser = await this.users.findByEmail(email);
    if (existingUser) {
      const resetPasswordKey = uuidv4();

      this.users
        .updateResetPasswordKeyByEmail(email, resetPasswordKey)
        .then((responseUserDto) => {
          if (responseUserDto) {
            SysMailer.mailResetPasswordConfirmation(responseUserDto)
              .then(() => {
                responseUserDto.pwd_reset_key = '';
                response.send(responseUserDto);
              })
              .catch(() => {
                next(new ResetPasswordKeyException(email, ''));
              });
          } else {
            next(new ResetPasswordKeyException(email, ''));
          }
        });
    } else {
      next(new ResetPasswordKeyException(email, ''));
    }
  };

  private validateResetPasswordKey = async (
    request: express.Request,
    response: express.Response
  ) => {
    const { email, resetPasswordKey } = request.params;
    const existingUser = await this.users.findByEmail(email);
    if (existingUser) {
      if (existingUser.pwd_reset_key !== resetPasswordKey) {
        response.send({ valid: false });
      } else {
        response.send({ valid: true });
      }
    } else {
      response.send({ valid: false });
    }
  };

  private resetPassword = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { email, resetPasswordKey, newPassword } = request.params;
    const existingUser = await this.users.findByEmail(email);
    if (existingUser) {
      if (existingUser.pwd_reset_key !== resetPasswordKey) {
        next(new ResetPasswordKeyException(email, resetPasswordKey));
      } else {
        this.users
          .updatePasswordNResetKeyByEmail(email, newPassword)
          .then((responseUserDto) => {
            if (responseUserDto) {
              responseUserDto.password = '';
              responseUserDto.pwd_reset_key = '';
              response.send(responseUserDto);
            } else {
              next(new ResetPasswordKeyException(email, resetPasswordKey));
            }
          });
      }
    } else {
      next(new ResetPasswordKeyException(email, resetPasswordKey));
    }
  };
}

export default AuthenticationController;

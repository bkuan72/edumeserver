import { UserAccountsData } from './schemas/userAccounts.schema';
import { UserAccountsDTO } from './dtos/userAccounts.DTO';
import { ResponseUserDTO } from './dtos/userDTO';
import { AccountDTO } from './dtos/accounts.DTO';

import { AccountModel } from './server/models/account.model';
import { serverCfg } from './config/db.config';
import { UserAccountModel } from './server/models/userAccount.model';
import { UserModel } from './server/models/user.model';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import dbConnection from './modules/DbModule';
import cookieParser = require('cookie-parser');
import SysLog from './modules/SysLog';
import toobusy_js = require('toobusy-js');
import ServerTooBusyException from './exceptions/ServerTooBusyException';
import rateLimit = require('express-rate-limit');
import SysEnv from './modules/SysEnv';
import cors = require('cors');
import { UserData } from './schemas/users.schema';
import { AccountData } from './schemas/accounts.schema';




class App {
  public app: express.Application;
  public port: number;
  public logger: any;

  constructor(controllers: any, port: number) {

    this.app = express.default();
    this.port = port;
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    // The default maxLag value is 70ms, and the default check interval is 500ms.
    // This allows an "average" server to run at 90-100% CPU and keeps request latency
    // at around 200ms. For comparison, a maxLag value of 10ms results in 60-70% CPU usage,
    // while latency for "average" requests stays at about 40ms
    toobusy_js.maxLag(SysEnv.TOOBUSY_MAX_LAG);
    toobusy_js.interval(SysEnv.TOOBUSY_CHECK_INTERVAL);
    toobusy_js.onLag(function(currentLag: number) {
      SysLog.info("Event loop lag detected! Latency: " + currentLag + "ms");
    });
  }

  loggerMiddleware = (request: express.Request, response: express.Response, next: any) => {
    SysLog.http('Request Header:' + JSON.stringify(request.headers));
    SysLog.http('Request Body :' + JSON.stringify(request.body));
    SysLog.http('Request Parameters :' + JSON.stringify(request.params))
    next();
  }

  limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 1000 requests per windowMs
  });


  private initializeMiddlewares() {
    const corsOptions = {
      origin: SysEnv.VALID_CORS_ORIGIN,
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ limit: "4kb", extended: true }));
    this.app.use(express.json({ limit: "10mb" }));
    // this.app.use(express.multipart({ limit:"10mb" }));
    // this.app.use(express.limit("5kb")); // this will be valid for every other content type
    this.app.use(this.loggerMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    //  apply to all requests
    this.app.use(this.limiter);

    this.app.use(function(req, res, next) {
      if (toobusy_js()) {
        next(new ServerTooBusyException());
      } else {
        next();
      }
    })
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach((controller: { router: import("express-serve-static-core").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>; }) => {
      this.app.use('/api', controller.router);
    });
  }

  private connectToTheDatabase() {
    dbConnection.DBM_connectDB()
    .then(async () => {
      const accounts = new AccountModel();
      const accountArray = await accounts.find({
        site_code: SysEnv.SITE_CODE
      });
      let devAccount: AccountDTO | AccountData | undefined;
      let adminAccount: AccountDTO | AccountData | undefined;
      if (accountArray) {
        accountArray.forEach((account) => {
          if (account.account_type == 'ADMIN') {
            adminAccount = account;
          } else {
            if (account.account_type == 'DEV') {
              devAccount = account;
            }
          }
        })
      }
      if (devAccount == undefined) {
        devAccount = await accounts.create({
          account_type: 'DEV',
          account_code: 'DEV_ACCOUNT',
          description: 'Dev Account',
          website: '',
          status: 'APPROVED'
        });
      }
      if (adminAccount == undefined) {
        adminAccount = await accounts.create({
          account_type: 'ADMIN',
          account_code: 'ADMIN_ACCOUNT',
          description: 'Admin Account',
          website: '',
          status: 'APPROVED'
        });
      }

      const users = new UserModel();
      let adminUser: ResponseUserDTO | UserData | undefined;
      let devUser: ResponseUserDTO | UserData | undefined;
      const userArray = await users.find({
                                          site_code: SysEnv.SITE_CODE
                                          });
      if (userArray) {
        userArray.forEach((user) => {
          if (user.email == serverCfg.defaultAdminEmail) {
            adminUser = user;
          } else; {
            if (user.email == serverCfg.defaultDevEmail) {
              devUser = user;
            }
          }
        });
      }

      if (adminUser === undefined) {
        adminUser = await users.create({
          user_id: serverCfg.defaultAdminUserId,
          email: serverCfg.defaultAdminEmail,
          title: 'N/A',
          user_name: serverCfg.defaultAdminUserName,
          password: serverCfg.defaultAdminPassword,
          phone_no: serverCfg.defaultAdminPhoneNo,
          mobile_no: serverCfg.defaultAdminPhoneNo,
          website: '',
          language: 'EN',
          status: 'ENABLED'
          });
      }


      if (devUser === undefined) {
        devUser = await users.create({
          user_id: serverCfg.defaultDevUserId,
          email: serverCfg.defaultDevEmail,
          title: 'N/A',
          user_name: serverCfg.defaultDevUserName,
          password: serverCfg.defaultDevPassword,
          phone_no: serverCfg.defaultDevPhoneNo,
          mobile_no: serverCfg.defaultDevPhoneNo,
          website: '',
          language: 'EN',
          status: 'ENABLED'
          });
      }

      const userAccounts = new UserAccountModel();
      let devUserAccount: UserAccountsDTO | UserAccountsData | undefined;
      let devAdminUserAccount: UserAccountsDTO | UserAccountsData | undefined;
      let adminUserAccount: UserAccountsDTO | UserAccountsData | undefined;
      const userAccountArray = await userAccounts.find({
        site_code: SysEnv.SITE_CODE
      })
      if (userAccountArray) {
        userAccountArray.forEach((userAccount) => {
          if (userAccount.account_id === adminAccount?.id &&
              userAccount.user_id === adminUser?.id) {
            adminUserAccount = userAccount;
          } else {
            if (userAccount.account_id === adminAccount?.id &&
              userAccount.user_id === devUser?.id) {
              devAdminUserAccount = userAccount;
           } else {
            if (userAccount.account_id === devAccount?.id &&
              userAccount.user_id === devUser?.id) {
              devUserAccount = userAccount;
            }
           }
          }
        });
      }

      if (adminUserAccount === undefined && adminUser && adminAccount) {
        await userAccounts.create({
          user_id: adminUser.id,
          account_id: adminAccount.id
        });
      }
      if (devAdminUserAccount === undefined && devUser && adminAccount) {
        await userAccounts.create({
          user_id: devUser.id,
          account_id: adminAccount.id
        });
      }
      if (devUserAccount === undefined && devUser && devAccount) {
        await userAccounts.create({
          user_id: devUser.id,
          account_id: devAccount.id
        });
      }

    })
    .catch((err) => {
      throw(err);
    });
  }

  public listen() {
    console.log(`App listening on the port ${this.port}`);
    this.app.listen(this.port, () => {
      SysLog.info(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
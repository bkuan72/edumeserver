import { AccountDTO } from './dtos/accounts.DTO';
import { UserAccountsDTO } from './dtos/userAccounts.DTO';
import { CreateUserDTO } from './dtos/CreateUserDTO';
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
import CommonFn from './modules/CommonFnModule';
import { AccountTypeEnum, AccountStatusEnum } from './schemas/accounts.schema';
import { UserStatusEnum } from './schemas/users.schema';




class App {
  public app: express.Application;
  public port: number;
  public logger: any;

  constructor(controllers: any, port: number) {
    // The default maxLag value is 70ms, and the default check interval is 500ms.
    // This allows an "average" server to run at 90-100% CPU and keeps request latency
    // at around 200ms. For comparison, a maxLag value of 10ms results in 60-70% CPU usage,
    // while latency for "average" requests stays at about 40ms
    toobusy_js.maxLag(70);
    toobusy_js.interval(500);
    toobusy_js.onLag(function(currentLag: number) {
      SysLog.info("Event loop lag detected! Latency: " + currentLag + "ms");
    });
    this.app = express.default();
    this.port = port;
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  loggerMiddleware = (request: express.Request, response: express.Response, next: any) => {
    SysLog.http('Request Header:' + JSON.stringify(request.headers));
    SysLog.http('Request Body :' + JSON.stringify(request.body));
    SysLog.http('Request Parameters :' + JSON.stringify(request.params))
    next();
  }

  limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
  });


  private initializeMiddlewares() {
    this.app.use(express.urlencoded({ limit: "1kb" }));
    this.app.use(express.json({ limit: "1kb" }));
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
      const account = await accounts.find({
        site_code: SysEnv.SITE_CODE,
        account_type: AccountTypeEnum.ADMIN
      });
      if (CommonFn.isUndefined(account)) {

        const newAccount = await accounts.create({
          account_type: 'ADMIN',
          account_code: 'ADMIN_ACCOUNT',
          description: 'Admin Account',
          website: '',
          status: 'APPROVED'
        });
        if (newAccount) {
          const users = new UserModel();
          const user = await users.find({
            site_code: SysEnv.SITE_CODE,
            email: serverCfg.defaultAdminEmail
           });
           if (CommonFn.isUndefined(user)) {
              const newUser = await users.create({
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
              if (newUser) {
                const userAccounts = new UserAccountModel();
                userAccounts.create({
                  user_id: newUser.data.id,
                  account_id: newAccount.data.id
                });
             }
           }
        }
      }
    })
    .catch((err) => {
      throw(err);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      SysLog.info(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
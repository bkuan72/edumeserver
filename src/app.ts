import { UserModuleRoleData } from './schemas/userModuleRoles.schema';
import { UserModuleRoleDTO } from './dtos/userModuleRoles.DTO';
import { UserModuleRoleModel } from './server/models/userModuleRole.model';
import { ModuleModel } from './server/models/module.model';
import { RoleData } from './schemas/roles.schema';
import { RoleDTO } from './dtos/roles.DTO';
import { RoleModel } from './server/models/role.model';
import { UserAccountsData } from './schemas/userAccounts.schema';
import { UserAccountsDTO } from './dtos/userAccounts.DTO';
import { ResponseUserDTO } from './dtos/user.DTO';
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
import { ModuleDTO } from './dtos/modules.DTO';
import { ModuleData } from './schemas/modules.schema';
import { PropertyModel } from './server/models/property.model';
import { ServerDefaultProperties, ServerPropertyTypeEnum } from './config/server.default.properties';




class App {
  public app: express.Application;
  public port: number;
  public logger: any;
  private properties: PropertyModel;

  constructor(controllers: any, port: number) {
    this.properties = new PropertyModel();
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
    this.app.use(express.urlencoded({ limit: "5mb", extended: true }));
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

  private createDefaultProperties(index: number): Promise<void> {
    return new Promise<void>((resolve) => {
        if (index >= ServerDefaultProperties.length) {
          resolve();
        } else {
          const prop = ServerDefaultProperties[index];
          const propName = SysEnv.SITE_CODE +'.'+ prop.name
          this.properties.find({
            name: propName
          }).then((propArray) => {
            if (propArray.length === 0) {
              const newProperty = {
                name: '',
                property_type: '',
                value: '',
                numValue: 0
              };
              newProperty.name = propName;
              switch(prop.type) {
                case ServerPropertyTypeEnum.INT:
                  if (prop.numValue) {
                    newProperty.numValue = prop.numValue;
                  }
                  newProperty.property_type = 'INT';
                  break;
                case ServerPropertyTypeEnum.TEXT:
                  if (prop.value) {
                    newProperty.value = prop.value;
                  }
                  newProperty.property_type = 'TEXT';
                break;
              }
              this.properties.create(newProperty).finally(() => {
                this.createDefaultProperties(index + 1);
              })
            }
          });

        }

    });
  }

  private connectToTheDatabase() {
    dbConnection.DBM_connectDB()
    .then(async () => {

      this.createDefaultProperties(0);

      await this.createDefaultUserRoleAccounts();

    })
    .catch((err) => {
      throw(err);
    });
  }

  private async createDefaultUserRoleAccounts() {
    const roles = new RoleModel();
    const { devRole, adminRole }: { devRole: any; adminRole: any; } = await this.createDefaultRoles(roles);

    const allModule: ModuleDTO | ModuleData | undefined = await this.createDefaultModules();

    const { devUser,
            adminUser,
            adminAccount,
            devAccount }: { devUser: any;
                            adminUser: any;
                            adminAccount: any;
                            devAccount: any; } = await this.createDefaultAccounts();

    await this.createDefaultUserModuleRoles(allModule, devUser, devRole, adminUser, adminRole);


    await this.createDefaultUserAccounts(adminAccount, adminUser, devUser, devAccount);
  }

  private async createDefaultRoles(roles: RoleModel) {
    const roleArray = await roles.find({
      site_code: SysEnv.SITE_CODE
    });
    let devRole: RoleDTO | RoleData | undefined;
    let adminRole: RoleDTO | RoleData | undefined;
    let stdRole: RoleDTO | RoleData | undefined;
    if (roleArray) {
      roleArray.forEach((role) => {
        if (role.role_code === 'ADMIN') {
          adminRole = role;
        } else {
          if (role.role_code === 'DEV') {
            devRole = role;
          } else {
            if (role.role_code === 'STANDARD') {
              stdRole = role;
            }
          }
        }
      });
    }

    if (devRole == undefined) {
      devRole = await roles.create({
        role_code: 'DEV',
        description: 'Developer Role',
        add_ok: true,
        edit_ok: true,
        delete_ok: true,
        configure_ok: true,
        dev_ok: true,
        status: 'OK'
      });
    }
    if (adminRole == undefined) {
      adminRole = await roles.create({
        role_code: 'ADMIN',
        description: 'Website Admin Role',
        add_ok: true,
        edit_ok: true,
        delete_ok: true,
        configure_ok: true,
        dev_ok: false,
        status: 'OK'
      });
    }
    if (stdRole == undefined) {
      stdRole = await roles.create({
        role_code: 'STANDARD',
        description: 'Standard User Role',
        add_ok: true,
        edit_ok: true,
        delete_ok: true,
        configure_ok: false,
        dev_ok: false,
        status: 'OK'
      });
    }
    return { devRole, adminRole };
  }

  private async createDefaultModules() {
    const module = new ModuleModel();
    const moduleArray = await module.find({
      site_code: SysEnv.SITE_CODE
    });
    let allModule: ModuleDTO | ModuleData | undefined;
    if (moduleArray) {
      moduleArray.forEach((module) => {
        if (module.module_code == 'ALL') {
          allModule = module;
        }
      });
    }
    if (allModule == undefined) {
      allModule = await module.create({
        module_code: 'ALL',
        description: 'All Modules',
        status: 'OK'
      });
    }
    return allModule;
  }

  private async createDefaultAccounts() {
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
      });
    }
    if (devAccount == undefined) {
      devAccount = await accounts.createDevAccount({
        account_code: 'DEV_ACCOUNT',
        account_name: 'Developer Account',
        description: 'Dev Account',
        website: '',
        status: 'APPROVED'
      });
    }
    if (adminAccount == undefined) {
      adminAccount = await accounts.createAdminAccount({
        account_code: 'ADMIN_ACCOUNT',
        account_name: 'Website Admin Account',
        description: 'Admin Account',
        website: '',
        status: 'APPROVED'
      });
    }

    const { devUser,
      adminUser }: {
                      devUser: any;
                      adminUser: any; } = await this.createDefaultUsers();
    return { devUser, adminUser, adminAccount, devAccount };
  }

  private async createDefaultUsers() {
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
        }

        else
          ; {
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
        first_name: serverCfg.defaultAdminUserName,
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
        first_name: serverCfg.defaultAdminUserName,
        user_name: serverCfg.defaultDevUserName,
        password: serverCfg.defaultDevPassword,
        phone_no: serverCfg.defaultDevPhoneNo,
        mobile_no: serverCfg.defaultDevPhoneNo,
        website: '',
        language: 'EN',
        status: 'ENABLED'
      });
    }
    return { devUser, adminUser };
  }

  private async createDefaultUserModuleRoles(allModule: any, devUser: any, devRole: any, adminUser: any, adminRole: any) {
    const userModuleRole = new UserModuleRoleModel();
    const devUserStdModuleRoleArray = await userModuleRole.find({
      site_code: SysEnv.SITE_CODE,
      module_id: allModule.id,
      user_id: devUser.id,
      role_id: devRole.id
    });
    let devUserStdModuleRole: UserModuleRoleDTO | UserModuleRoleData | undefined;
    if (devUserStdModuleRoleArray && devUserStdModuleRoleArray.length > 0) {
      devUserStdModuleRole = devUserStdModuleRoleArray[0];
    }
    if (devUserStdModuleRole === undefined) {
      await userModuleRole.create({
        site_code: SysEnv.SITE_CODE,
        module_id: allModule.id,
        user_id: devUser.id,
        role_id: devRole.id
      });
    }
    const adminUserStdModuleRoleArray = await userModuleRole.find({
      site_code: SysEnv.SITE_CODE,
      module_id: allModule.id,
      user_id: adminUser.id,
      role_id: adminRole.id
    });
    let adminUserStdModuleRole: UserModuleRoleDTO | UserModuleRoleData | undefined;
    if (adminUserStdModuleRoleArray && devUserStdModuleRoleArray.length > 0) {
      adminUserStdModuleRole = adminUserStdModuleRoleArray[0];
    }
    if (adminUserStdModuleRole === undefined) {
      await userModuleRole.create({
        site_code: SysEnv.SITE_CODE,
        module_id: allModule.id,
        user_id: adminUser.id,
        role_id: adminRole.id
      });
    }
  }

  private async createDefaultUserAccounts(adminAccount: any, adminUser: any, devUser: any, devAccount: any) {
    const userAccounts = new UserAccountModel();
    let devUserAccount: UserAccountsDTO | UserAccountsData | undefined;
    let devAdminUserAccount: UserAccountsDTO | UserAccountsData | undefined;
    let adminUserAccount: UserAccountsDTO | UserAccountsData | undefined;
    const userAccountArray = await userAccounts.find({
      site_code: SysEnv.SITE_CODE
    });
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
  }

  public listen() {
    console.log(`App listening on the port ${this.port}`);
    this.app.listen(this.port, () => {
      SysLog.info(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
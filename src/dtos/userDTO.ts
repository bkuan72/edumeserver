/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonFn from '../modules/CommonFnModule';
import DTOGenerator from '../modules/ModelGenerator';
import { UserData, users_schema } from "../schemas/users.schema";

export class ResponseUserDTO {
  data: UserData;
  constructor(user?: any,
              showPassword?: boolean) {
    DTOGenerator.genDTOFromSchema(this, users_schema);
    if (!CommonFn.isUndefined(user)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(user, prop)) {
          if (prop === 'password') {
            if (!CommonFn.isUndefined(showPassword) && showPassword) {
              this[prop] = user[prop];
            }
          }
          else {
            this[prop] = user[prop];
          }
        }
      }
    }
  }
}

export class CreateUserDTO {
  data: UserData;
  constructor(user?: any) {
    DTOGenerator.genDTOFromSchema(this, users_schema);
    if (!CommonFn.isUndefined(user)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(user, prop)) {
          this[prop] = user[prop];
        }
      }
    }
  }
}

export class UpdUserDTO {
  data: UserData;
  constructor(user?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, users_schema, ['password']);
    if (!CommonFn.isUndefined(user)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(user, prop)) {
          this[prop] = user[prop];
        }
      }
    }
  }
}

export class InsertUserDTO {
  data: UserData;
  constructor(user?: any) {
    DTOGenerator.getInsertDTOFromSchema (this, users_schema);
    if (!CommonFn.isUndefined(user)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(user, prop)) {
          this[prop] = user[prop];
        }
      }
    }
  }
}
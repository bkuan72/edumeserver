/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUndefined } from '../modules/isUndefined';
import CommonFn from '../modules/CommonFnModule';
import DTOGenerator from '../modules/ModelGenerator';
import { UserData, users_schema } from "../schemas/users.schema";

export class ResponseUserDTO {
  data: UserData;
  constructor(user?: any,
              showPassword?: boolean) {
    this.data = DTOGenerator.genSchemaModel(users_schema);
    if (!isUndefined(user)) {
      for (const prop in user) {
        if (CommonFn.hasProperty(this.data, prop)) {
          if (prop === 'password') {
            if (isUndefined(showPassword) || showPassword === false) {
              this.data[prop] = undefined;
            } else {
              this.data[prop] = user[prop];
            }
          }
          else {
            this.data[prop] = user[prop];
          }
        }
      }
    }
  }
}

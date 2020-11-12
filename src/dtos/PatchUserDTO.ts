/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUndefined } from '../modules/isUndefined';
import CommonFn from '../modules/CommonFnModule';
import DTOGenerator from '../modules/ModelGenerator';
import { UserData, users_schema } from "../schemas/users.schema";

export class PatchUserDTO {
  data: UserData;
  constructor(user?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(users_schema, ['password']);
    if (!isUndefined(user)) {
      for (const prop in user) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = user[prop];
        }
      }
    }
  }
}

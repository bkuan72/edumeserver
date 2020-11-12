/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUndefined } from '../modules/isUndefined';
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { UserAccountsData, userAccounts_schema } from '../schemas/userAccounts.schema';


export class UserAccountsDTO {
  data: UserAccountsData;
  constructor(userAccountData?: any) {
    this.data = DTOGenerator.genSchemaModel(userAccounts_schema);
    if (!isUndefined(userAccountData)) {
      for (const prop in userAccountData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = userAccountData[prop];
        }
      }
    }
  }
}
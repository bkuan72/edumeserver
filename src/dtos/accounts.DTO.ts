/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AccountData, accounts_schema } from '../schemas/accounts.schema';
import { isUndefined } from '../modules/isUndefined';


export class AccountDTO {
  data: AccountData;
  constructor(accountData?: any) {
    this.data = DTOGenerator.genSchemaModel(accounts_schema);
    if (!isUndefined(accountData)) {
      for (const prop in accountData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = accountData[prop];
        }
      }
    }
  }
}
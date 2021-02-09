/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AccountData, accounts_schema } from '../schemas/accounts.schema';


export class AccountDTO {
  data: AccountData;
  constructor(accountData?: any) {
    DTOGenerator.genDTOFromSchema(this, accounts_schema);
    if (!CommonFn.isUndefined(accountData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(accountData, prop)) {
          this[prop] = accountData[prop];
        }
      }
    }
  }
}

export class UpdAccountDTO {
  data: AccountData;
  constructor(accountData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, accounts_schema);
    if (!CommonFn.isUndefined(accountData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(accountData, prop)) {
          this[prop] = accountData[prop];
        }
      }
    }
  }
}
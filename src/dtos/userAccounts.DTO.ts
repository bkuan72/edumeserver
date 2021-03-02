import { accounts_schema } from './../schemas/accounts.schema';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { UserAccountsData, userAccounts_schema } from '../schemas/userAccounts.schema';


export class UserAccountsDTO {
  data: UserAccountsData;
  constructor(userAccountData?: any) {
    DTOGenerator.genDTOFromSchema(this, userAccounts_schema);
    if (!CommonFn.isUndefined(userAccountData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(userAccountData, prop)) {
          this[prop] = userAccountData[prop];
        }
      }
    }
  }
}

export class UpdUserAccountsDTO {
  data: UserAccountsData;
  constructor(userAccountData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, userAccounts_schema);
    if (!CommonFn.isUndefined(userAccountData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(userAccountData, prop)) {
          this[prop] = userAccountData[prop];
        }
      }
    }
  }
}

export class UserAccountDataDTO {
  constructor(userAccountData?: any) {
    DTOGenerator.genDTOFromSchema(this, accounts_schema, ['id']);
    if (!CommonFn.isUndefined(userAccountData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(userAccountData, prop)) {
          this[prop] = userAccountData[prop];
        }
      }
    }
    DTOGenerator.defineProperty(
      this,
      'user_account_id',
      ''
      );
    DTOGenerator.defineProperty(
      this,
      'account_id',
      ''
      );
    DTOGenerator.defineProperty(
      this,
      'user_id',
      ''
      );
  }

}
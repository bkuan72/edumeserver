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


export class AboutAccountDTO {
  general: {
      account_name: string,
      locations: string[],
      about: string,
  };
  work: {
      occupation: string,
      skills: string,
      jobs: string
  };
  contact: {
      address: string;
      tel: string[];
      websites: string[];
      emails: string[];
  };
  groups: {
      name: string;
      category: string;
      members: string
  }[];
  friends: {
      name: string,
      avatar: string
  }[];

  constructor ( ) {
      this.general = {
          account_name: '',
          locations: [],
          about: ''
      };
      this.work = {
          occupation: '',
          skills: '',
          jobs: ''
      };
      this.contact = {
          address: '',
          tel: [],
          websites:[],
          emails:[]
      };
      this.groups = [];
      this.friends = [];
  }
}
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AccountGroupMemberData, accountGroupMembers_schema } from '../schemas/accountGroupMembers.schema';


export class AccountGroupMemberDTO {
  data: AccountGroupMemberData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupMembers_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdAccountGroupMemberDTO {
  data: AccountGroupMemberData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, accountGroupMembers_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class AccountGroupMemberListDTO {
    id: string;
    user_id: string;
    account_id: string;
    group_id: string;
    name: string;
    avatar: string;
    since: string;
    constructor () {
        this.id = '';
        this.account_id = '';
        this.group_id = '';
        this.user_id = '';
        this.name = '';
        this.avatar = '';
        this.since = '';
    }
}
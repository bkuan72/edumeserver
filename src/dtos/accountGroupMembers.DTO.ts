import { users_schema } from './../schemas/users.schema';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AccountGroupMemberData, accountGroupMembers_schema } from '../schemas/accountGroupMembers.schema';


export class AccountGroupMemberDTO {
   // data: AccountGroupMemberData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupMembers_schema, undefined, propertyData);
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
   // data: AccountGroupMemberData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, accountGroupMembers_schema, undefined, propertyData);
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
  name: string;
  avatar: string;
  since: string;
  constructor () {
      this.id = '';
      this.user_id = '';
      this.name = '';
      this.avatar = '';
      this.since = '';
  }
}

export class ContactListDTO {
   // data: AccountGroupMemberData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupMembers_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
    DTOGenerator.defineProperty(
      this,
      'user',
      DTOGenerator.genDTOFromSchema({}, users_schema, undefined, propertyData)
    );
  }

}

const ContactListDataModel = DTOGenerator.genDTOFromSchema(this, accountGroupMembers_schema);
DTOGenerator.defineProperty(
  ContactListDataModel,
  'user',
  DTOGenerator.genDTOFromSchema({}, users_schema)
);

export type ContactListData = typeof ContactListDataModel;
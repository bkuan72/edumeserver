import { users_schema } from './../schemas/users.schema';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { FriendData, friends_schema } from '../schemas/friends.schema';


export class FriendDTO {
   // data: FriendData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, friends_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdFriendDTO {
   // data: FriendData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, friends_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class FriendListDTO {
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
   // data: FriendData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, friends_schema, undefined, propertyData);
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
      DTOGenerator.genDTOFromSchema({}, users_schema)
    );
  }

}

const ContactListDataModel = DTOGenerator.genDTOFromSchema(this, friends_schema);
DTOGenerator.defineProperty(
  ContactListDataModel,
  'user',
  DTOGenerator.genDTOFromSchema({}, users_schema)
);

export type ContactListData = typeof ContactListDataModel;
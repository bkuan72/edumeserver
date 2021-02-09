/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { FriendData, friends_schema } from '../schemas/friends.schema';


export class FriendDTO {
  data: FriendData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, friends_schema);
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
  data: FriendData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, friends_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}
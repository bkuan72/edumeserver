/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { FriendData, friends_schema } from '../schemas/friends.schema';


export class FriendDTO {
  data: FriendData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genSchemaModel(friends_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdFriendDTO {
  data: FriendData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(friends_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { UserMediaData, userMedias_schema } from '../schemas/userMedias.schema';


export class UserMediaDTO {
  data: UserMediaData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genSchemaModel(userMedias_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdUserMediaDTO {
  data: UserMediaData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(userMedias_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}
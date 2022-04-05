/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { UserMediaData, userMedias_schema } from '../schemas/userMedias.schema';


export class UserMediaDTO {
  data: UserMediaData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, userMedias_schema, ['fullImage'], propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdUserMediaDTO {
  data: UserMediaData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, userMedias_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class RequestUserMediaDTO {
  data: UserMediaData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, userMedias_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UserMediaFullImageDTO {
  id: string;
  fullImage: string;
  constructor(propertyData?: any) {
    this.id = '';
    this.fullImage = '';
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}
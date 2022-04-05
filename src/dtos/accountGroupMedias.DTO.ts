/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AccountGroupMediaData, accountGroupMedias_schema } from '../schemas/accountGroupMedias.schema';


export class AccountGroupMediaDTO {
  data: AccountGroupMediaData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupMedias_schema, ['fullImage'], propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdAccountGroupMediaDTO {
  data: AccountGroupMediaData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, accountGroupMedias_schema, undefined,  propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class AccountGroupMediaFullImageDTO {
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

export class RequestAccountGroupMediaDTO {
  data: AccountGroupMediaData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupMedias_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}
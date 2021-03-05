/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { UserMediaPeriodData, userMediaPeriods_schema } from '../schemas/userMediaPeriods.schema';


export class UserMediaPeriodDTO {
  data: UserMediaPeriodData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, userMediaPeriods_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdUserMediaPeriodDTO {
  data: UserMediaPeriodData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, userMediaPeriods_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UserMediaPeriodDataDTO {
    data: UserMediaPeriodData;
    constructor(propertyData?: any) {
      DTOGenerator.genDTOFromSchema(this, userMediaPeriods_schema, ['fullImage']);
      if (!CommonFn.isUndefined(propertyData)) {
        for (const prop in this) {
          if (CommonFn.hasProperty(propertyData, prop)) {
            this[prop] = propertyData[prop];
          }
        }
      }
      DTOGenerator.defineProperty(
        this,
        'medias',
        []
      );
      DTOGenerator.defineProperty(
        this,
        'showAllMedia',
        false
      );
      DTOGenerator.defineProperty(
        this,
        'loadingMedia',
        false
      );
    }
  }
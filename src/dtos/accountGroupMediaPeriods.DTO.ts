/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AccountGroupMediaPeriodData, accountGroupMediaPeriods_schema } from '../schemas/accountGroupMediaPeriods.schema';


export class AccountGroupMediaPeriodDTO {
  data: AccountGroupMediaPeriodData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupMediaPeriods_schema, ['fullImage'], propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdAccountGroupMediaPeriodDTO {
  data: AccountGroupMediaPeriodData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, accountGroupMediaPeriods_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class AccountGroupMediaPeriodDataDTO {
    data: AccountGroupMediaPeriodData;
    constructor(propertyData?: any) {
      DTOGenerator.genDTOFromSchema(this, accountGroupMediaPeriods_schema, ['fullImage'], propertyData);
      if (!CommonFn.isUndefined(propertyData)) {
        for (const prop in this) {
          if (CommonFn.hasProperty(propertyData, prop)) {
            this[prop] = propertyData[prop];
          }
        }
      }
      DTOGenerator.defineProperty(
        this,
        'media',
        []
      );
      DTOGenerator.defineProperty(
        this,
        'showAllMedia',
        []
      );
    }
  }
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AdAgeGroupData, adAgeGroups_schema } from '../schemas/adAgeGroups.schema';


export class AdAgeGroupDTO {
   // data: AdAgeGroupData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, adAgeGroups_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdAdAgeGroupDTO {
   // data: AdAgeGroupData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, adAgeGroups_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}
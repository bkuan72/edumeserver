/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AdActivityData, adActivities_schema } from '../schemas/adActivities.schema';


export class AdActivityDTO {
  data: AdActivityData;
  constructor(propertyData?: any) {
  DTOGenerator.genDTOFromSchema(this, adActivities_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdAdActivityDTO {
  data: AdActivityData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, adActivities_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(this, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AdCategoryData, adCategories_schema } from '../schemas/adCategories.schema';


export class AdCategoryDTO {
  data: AdCategoryData;
  constructor(propertyData?: any) {
  DTOGenerator.genDTOFromSchema(this, adCategories_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdAdCategoryDTO {
  data: AdCategoryData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, adCategories_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(this, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}
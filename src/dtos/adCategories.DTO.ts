/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AdCategoryData, adCategories_schema } from '../schemas/adCategories.schema';


export class AdCategoryDTO {
  data: AdCategoryData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genSchemaModel(adCategories_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdAdCategoryDTO {
  data: AdCategoryData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(adCategories_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}
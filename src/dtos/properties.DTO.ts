/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { PropertyData, properties_schema } from '../schemas/properties.schema';


export class PropertyDTO {
  data: PropertyData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genSchemaModel(properties_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdPropertyDTO {
  data: PropertyData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(properties_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}
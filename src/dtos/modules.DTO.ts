/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { ModuleData, modules_schema } from '../schemas/modules.schema';


export class ModuleDTO {
  data: ModuleData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, modules_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdModuleDTO {
  data: ModuleData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, modules_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}
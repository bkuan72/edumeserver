/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { RoleData, roles_schema } from '../schemas/roles.schema';


export class RoleDTO {
  data: RoleData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, roles_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdRoleDTO {
  data: RoleData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, roles_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}
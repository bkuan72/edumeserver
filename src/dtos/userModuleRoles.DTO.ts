import { modules_schema } from './../schemas/modules.schema';
import { roles_schema } from './../schemas/roles.schema';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { UserModuleRoleData, userModuleRoles_schema } from '../schemas/userModuleRoles.schema';


export class UserModuleRoleDTO {
  data: UserModuleRoleData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, userModuleRoles_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdUserModuleRoleDTO {
  data: UserModuleRoleData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, userModuleRoles_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UserModuleRoleDataDTO {
    constructor(propertyData?: any) {
      DTOGenerator.genDTOFromSchema(this, userModuleRoles_schema);
      if (!CommonFn.isUndefined(propertyData)) {
        for (const prop in this) {
          if (CommonFn.hasProperty(propertyData, prop)) {
            this[prop] = propertyData[prop];
          }
        }
      }
      DTOGenerator.defineProperty(
        this,
        'role',
        DTOGenerator.genSchemaModel(roles_schema)
      );
      DTOGenerator.defineProperty(
        this,
        'module',
        DTOGenerator.genSchemaModel(modules_schema)
      );
    }
  }
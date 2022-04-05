/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { GroupData, socialGroups_schema } from '../schemas/groups.schema';


export class GroupDTO {
  data: GroupData;
  constructor(groupData?: any) {
    DTOGenerator.genDTOFromSchema(this, socialGroups_schema, undefined, groupData);
    if (!CommonFn.isUndefined(groupData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(groupData, prop)) {
          this[prop] = groupData[prop];
        }
      }
    }
  }
}

export class UpdGroupDTO {
  data: GroupData;
  constructor(groupData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, socialGroups_schema, undefined, groupData);
    if (!CommonFn.isUndefined(groupData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(groupData, prop)) {
          this[prop] = groupData[prop];
        }
      }
    }
  }
}
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { GroupData, socialGroups_schema } from '../schemas/groups.schema';


export class GroupDTO {
  data: GroupData;
  constructor(groupData?: any) {
    this.data = DTOGenerator.genSchemaModel(socialGroups_schema);
    if (!CommonFn.isUndefined(groupData)) {
      for (const prop in groupData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = groupData[prop];
        }
      }
    }
  }
}

export class UpdGroupDTO {
  data: GroupData;
  constructor(groupData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(socialGroups_schema);
    if (!CommonFn.isUndefined(groupData)) {
      for (const prop in groupData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = groupData[prop];
        }
      }
    }
  }
}
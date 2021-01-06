/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { UserGroupData, userGroups_schema } from '../schemas/userGroups.schema';


export class UserGroupsDTO {
  data: UserGroupData;
  constructor(userGroupData?: any) {
    this.data = DTOGenerator.genSchemaModel(userGroups_schema);
    if (!CommonFn.isUndefined(userGroupData)) {
      for (const prop in userGroupData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = userGroupData[prop];
        }
      }
    }
  }
}

export class UserGroupInfoDTO {
    id: string;
    status: string;
    group_id: string;
    user_id: string;
    join_date: string;
    name: string;
    category: string;
    lastUpdateUsec: number;
  constructor () {
    this.id = '';
    this.status = 'OK';
    this.group_id = '';
    this.user_id = '';
    this.join_date = '';
    this.lastUpdateUsec = 0;
    this.name = '';
    this.category = '';
  }
}

export class UpdUserGroupsDTO {
  data: UserGroupData;
  constructor(userGroupData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(userGroups_schema);
    if (!CommonFn.isUndefined(userGroupData)) {
      for (const prop in userGroupData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = userGroupData[prop];
        }
      }
    }
  }
}
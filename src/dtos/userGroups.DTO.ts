/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { UserGroupData, userGroups_schema } from '../schemas/userGroups.schema';


export class UserGroupsDTO {
   // data: UserGroupData;
  constructor(userGroupData?: any) {
    DTOGenerator.genDTOFromSchema(this, userGroups_schema, undefined, userGroupData);
    if (!CommonFn.isUndefined(userGroupData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(userGroupData, prop)) {
          this[prop] = userGroupData[prop];
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
    last_update_usec: number;
  constructor () {
    this.id = '';
    this.status = 'OK';
    this.group_id = '';
    this.user_id = '';
    this.join_date = '';
    this.last_update_usec = 0;
    this.name = '';
    this.category = '';
  }
}

export class UpdUserGroupsDTO {
   // data: UserGroupData;
  constructor(userGroupData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, userGroups_schema, undefined, userGroupData);
    if (!CommonFn.isUndefined(userGroupData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(userGroupData, prop)) {
          this[prop] = userGroupData[prop];
        }
      }
    }
  }
}

export class InsertUserGroupsDTO {
   // data: UserGroupData;
  constructor(userGroupData?: any) {
    DTOGenerator.getInsertDTOFromSchema (this, userGroups_schema);
    if (!CommonFn.isUndefined(userGroupData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(userGroupData, prop)) {
          this[prop] = userGroupData[prop];
        }
      }
    }
  }
}
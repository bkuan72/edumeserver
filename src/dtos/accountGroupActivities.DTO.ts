/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AccountGroupActivityData, accountGroupActivities_schema } from '../schemas/accountGroupActivities.schema';


export class AccountGroupActivityDTO {
  data: AccountGroupActivityData;
  constructor(activityData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupActivities_schema);
    if (!CommonFn.isUndefined(activityData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(activityData, prop)) {
          this[prop] = activityData[prop];
        }
      }
    }
    DTOGenerator.defineProperty(
      this,
      'user',
      {
        id: '',
        name: '',
        avatar: ''
      }
    );

  }

}

export class UpdAccountGroupActivityDTO {
  data: AccountGroupActivityData;
  constructor(activityData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, accountGroupActivities_schema);
    if (!CommonFn.isUndefined(activityData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(activityData, prop)) {
          this[prop] = activityData[prop];
        }
      }
    }
  }
}
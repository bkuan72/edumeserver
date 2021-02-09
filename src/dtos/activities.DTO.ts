/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { ActivityData, activities_schema } from '../schemas/activities.schema';


export class ActivityDTO {
  data: ActivityData;
  constructor(activityData?: any) {
    DTOGenerator.genDTOFromSchema(this, activities_schema);
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

export class UpdActivityDTO {
  data: ActivityData;
  constructor(activityData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, activities_schema);
    if (!CommonFn.isUndefined(activityData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(activityData, prop)) {
          this[prop] = activityData[prop];
        }
      }
    }
  }
}
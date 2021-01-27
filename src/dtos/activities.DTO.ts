/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { ActivityData, activities_schema } from '../schemas/activities.schema';


export class ActivityDTO {
  data: ActivityData;
  constructor(activityData?: any) {
    this.data = DTOGenerator.genSchemaModel(activities_schema);
    if (!CommonFn.isUndefined(activityData)) {
      for (const prop in activityData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = activityData[prop];
        }
      }
    }
    this.data = DTOGenerator.defineProperty(
      this.data,
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
    this.data = DTOGenerator.genUpdateSchemaModel(activities_schema);
    if (!CommonFn.isUndefined(activityData)) {
      for (const prop in activityData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = activityData[prop];
        }
      }
    }
  }
}
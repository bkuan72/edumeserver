/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import {UserTimelineCommentData, userTimelineComments_schema } from '../schemas/userTimelineComments.schema';



export class UserTimelineCommentDTO {
  data: UserTimelineCommentData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genSchemaModel(userTimelineComments_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdUserTimelineCommentDTO {
  data: UserTimelineCommentData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(userTimelineComments_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UserTimelineUserCommentDTO {
  data: UserTimelineCommentData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genSchemaModel(userTimelineComments_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
    this.data = DTOGenerator.defineProperty(
      this.data,
      'time',
      ''
    );
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
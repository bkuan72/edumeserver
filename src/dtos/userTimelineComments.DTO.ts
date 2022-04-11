/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import {UserTimelineCommentData, userTimelineComments_schema } from '../schemas/userTimelineComments.schema';



export class UserTimelineCommentDTO {
   // data: UserTimelineCommentData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, userTimelineComments_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdUserTimelineCommentDTO {
   // data: UserTimelineCommentData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, userTimelineComments_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UserTimelineUserCommentDTO {
   // data: UserTimelineCommentData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, userTimelineComments_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
    DTOGenerator.defineProperty(
      this,
      'time',
      ''
    );
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
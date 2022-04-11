/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AccountGroupTimelineCommentData, accountGroupTimelineComments_schema } from '../schemas/accountGroupTimelineComments.schema';



export class AccountGroupTimelineCommentDTO {
   // data: AccountGroupTimelineCommentData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupTimelineComments_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdAccountGroupTimelineCommentDTO {
   // data: AccountGroupTimelineCommentData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, accountGroupTimelineComments_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class AccountGroupTimelineUserCommentDTO {
   // data: AccountGroupTimelineCommentData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupTimelineComments_schema, undefined, propertyData);
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
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { PostCommentData, postComments_schema } from '../schemas/postComments.schema';


export class PostCommentDTO {
  data: PostCommentData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genSchemaModel(postComments_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdPostCommentDTO {
  data: PostCommentData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(postComments_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}
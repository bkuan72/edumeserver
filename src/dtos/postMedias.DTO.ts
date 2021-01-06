/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { PostMediaData, postMedias_schema } from '../schemas/postMedias.schema';


export class PostMediaDTO {
  data: PostMediaData;
  constructor(postMediaData?: any) {
    this.data = DTOGenerator.genSchemaModel(postMedias_schema);
    if (!CommonFn.isUndefined(postMediaData)) {
      for (const prop in postMediaData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = postMediaData[prop];
        }
      }
    }
  }
}

export class UpdPostMediaDTO {
  data: PostMediaData;
  constructor(postMediaData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(postMedias_schema);
    if (!CommonFn.isUndefined(postMediaData)) {
      for (const prop in postMediaData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = postMediaData[prop];
        }
      }
    }
  }
}
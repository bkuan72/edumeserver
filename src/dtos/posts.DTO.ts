/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { PostData, posts_schema } from '../schemas/posts.schema';


export class PostDTO {
  data: PostData;
  constructor(postData?: any) {
    this.data = DTOGenerator.genSchemaModel(posts_schema);
    if (!CommonFn.isUndefined(postData)) {
      for (const prop in postData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = postData[prop];
        }
      }
    }
  }
}


export class UpdPostDTO {
  data: PostData;
  constructor(postData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(posts_schema);
    if (!CommonFn.isUndefined(postData)) {
      for (const prop in postData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = postData[prop];
        }
      }
    }
  }
}
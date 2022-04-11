/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { PostData, posts_schema } from '../schemas/posts.schema';


export class PostDTO {
   // data: PostData;
  constructor(postData?: any) {
    DTOGenerator.genDTOFromSchema(this, posts_schema, undefined, postData);
    if (!CommonFn.isUndefined(postData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(postData, prop)) {
          this[prop] = postData[prop];
        }
      }
    }
  }
}


export class UpdPostDTO {
   // data: PostData;
  constructor(postData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, posts_schema, undefined, postData);
    if (!CommonFn.isUndefined(postData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(postData, prop)) {
          this[prop] = postData[prop];
        }
      }
    }
  }
}
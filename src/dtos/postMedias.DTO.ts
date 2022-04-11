/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { PostMediaData, postMedias_schema } from '../schemas/postMedias.schema';


export class PostMediaDTO {
   // data: PostMediaData;
  constructor(postMediaData?: any) {
    DTOGenerator.genDTOFromSchema(this, postMedias_schema, undefined, postMediaData);
    if (!CommonFn.isUndefined(postMediaData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(postMediaData, prop)) {
          this[prop] = postMediaData[prop];
        }
      }
    }
  }
}

export class UpdPostMediaDTO {
   // data: PostMediaData;
  constructor(postMediaData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, postMedias_schema, undefined, postMediaData);
    if (!CommonFn.isUndefined(postMediaData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(postMediaData, prop)) {
          this[prop] = postMediaData[prop];
        }
      }
    }
  }
}
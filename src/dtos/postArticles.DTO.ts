/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { PostArticleData, postArticles_schema } from '../schemas/postArticles.schema';


export class PostArticleDTO {
  data: PostArticleData;
  constructor(postArticleData?: any) {
    DTOGenerator.genDTOFromSchema(this, postArticles_schema);
    if (!CommonFn.isUndefined(postArticleData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(postArticleData, prop)) {
          this[prop] = postArticleData[prop];
        }
      }
    }
  }
}

export class UpdPostArticleDTO {
  data: PostArticleData;
  constructor(postArticleData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, postArticles_schema);
    if (!CommonFn.isUndefined(postArticleData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(postArticleData, prop)) {
          this[prop] = postArticleData[prop];
        }
      }
    }
  }
}
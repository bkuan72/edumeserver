/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { PostArticleData, postArticles_schema } from '../schemas/postArticles.schema';


export class PostArticleDTO {
  data: PostArticleData;
  constructor(postArticleData?: any) {
    this.data = DTOGenerator.genSchemaModel(postArticles_schema);
    if (!CommonFn.isUndefined(postArticleData)) {
      for (const prop in postArticleData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = postArticleData[prop];
        }
      }
    }
  }
}
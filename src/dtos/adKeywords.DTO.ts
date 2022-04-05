/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AdKeywordData, adKeywords_schema } from '../schemas/adKeywords.schema';


export class AdKeywordDTO {
  data: AdKeywordData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, adKeywords_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdAdKeywordDTO {
  data: AdKeywordData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, adKeywords_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}
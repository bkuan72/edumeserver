/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUndefined } from '../modules/isUndefined';
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { TokenData, token_schema } from '../schemas/tokens.schema';


export class TokenDTO {
  data: TokenData;
  constructor(tokenData?: any) {
    this.data = DTOGenerator.genSchemaModel(token_schema);
    if (!isUndefined(tokenData)) {
      for (const prop in tokenData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = tokenData[prop];
        }
      }
    }
  }
}
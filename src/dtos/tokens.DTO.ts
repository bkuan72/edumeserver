/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { TokenData, token_schema } from '../schemas/tokens.schema';


export class TokenDTO {
  data: TokenData;
  constructor(tokenData?: any) {
    DTOGenerator.genDTOFromSchema(this, token_schema);
    if (!CommonFn.isUndefined(tokenData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(tokenData, prop)) {
          this[prop] = tokenData[prop];
        }
      }
    }
  }
}
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginData, loginDTO_schema } from '../schemas/loginDTO.schema';
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';


export class LoginDTO {
  data: LoginData;
  constructor(loginData?: any) {
    this.data = DTOGenerator.genSchemaModel(loginDTO_schema);
    if (loginData !== undefined) {
      for (const prop in loginData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = loginData[prop];
        }
      }
    }
  }
}

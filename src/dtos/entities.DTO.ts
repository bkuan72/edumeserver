/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { EntityData, entities_schema } from '../schemas/entities.schema';


export class EntityDTO {
  data: EntityData;
  constructor(accountData?: any) {
    this.data = DTOGenerator.genSchemaModel(entities_schema);
    if (!CommonFn.isUndefined(accountData)) {
      for (const prop in accountData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = accountData[prop];
        }
      }
    }
  }
}
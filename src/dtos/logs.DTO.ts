/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { LogData, logs_schema } from '../schemas/logs.schema';
import { isUndefined } from '../modules/isUndefined';


export class LogDTO {
  data: LogData;
  constructor(logData?: any) {
    this.data = DTOGenerator.genSchemaModel(logs_schema);
    if (!isUndefined(logData)) {
      for (const prop in logData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = logData[prop];
        }
      }
    }
  }
}
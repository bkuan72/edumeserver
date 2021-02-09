/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { LogData, logs_schema } from '../schemas/logs.schema';


export class LogDTO {
  data: LogData;
  constructor(logData?: any) {
    DTOGenerator.genDTOFromSchema(this, logs_schema);
    if (!CommonFn.isUndefined(logData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(logData, prop)) {
          this[prop] = logData[prop];
        }
      }
    }
  }
}
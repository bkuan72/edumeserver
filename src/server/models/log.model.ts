/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection from '../../modules/DbModule';
import { logs_schema, logs_schema_table } from '../../schemas/logs.schema';
import { LogDTO } from '../../dtos/logs.DTO';
import { uuidIfc } from './uuidIfc';
import { EntityModel } from './entity.model';
import SysLog from '../../modules/SysLog';

export class LogModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = logs_schema_table;
    }
    this.requestDTO = LogDTO;
    this.responseDTO = LogDTO;
    this.schema = logs_schema;
  }

  findByLogDate = (logDate: Date): Promise<any | undefined> => {
    return new Promise ((resolve) => {
      let sql =
      SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('EntryDate = ?', [logDate]);
      SysLog.info('findByLogDate SQL: ' + sql);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length) {
          const data = SqlFormatter.transposeResultSet(this.schema,
            undefined,
            undefined,
            result.rows[0]);
            const respEntityDTO = new this.responseDTO(data);
            resolve(respEntityDTO);
            return;
          }
          // not found Customer with the id
          resolve(undefined);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      })
    });
  };
}

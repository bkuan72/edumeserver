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

  findByLogDate = (logDate: Date): Promise<any[]> => {
    return new Promise ((resolve) => {
      const respEntityDTOArray: any[] = [];
      let sql =
      SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('EntryDate = ?', [logDate])
      SysLog.info('findByLogDate SQL: ' + sql) + ' AND ';
      sql = SqlFormatter.formatWhereAND(sql, {site_code: this.siteCode}, this.tableName, this.schema);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
 
        if (result.rows.length) {
          result.rows.forEach((rowData) => {
            const data = SqlFormatter.transposeResultSet(this.schema,
              undefined,
              undefined,
              rowData);
              const respEntityDTO = new this.responseDTO(data);
              respEntityDTOArray.push(respEntityDTO);
          });
            resolve(respEntityDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(respEntityDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(respEntityDTOArray);
        return;
      })
    });
  };
}

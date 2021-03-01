import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { userMedias_schema, userMedias_schema_table } from '../../schemas/userMedias.schema';
import { UserMediaDTO } from '../../dtos/userMedias.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import dbConnection from '../../modules/DbModule';

export class UserMediaModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = userMedias_schema_table;
    }
    this.requestDTO = UserMediaDTO;
    this.responseDTO = UserMediaDTO;
    this.schema = userMedias_schema;
  }

  findByUserId = (
    userId: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resUserMediaDTOArray: UserMediaDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]);
      SysLog.info('findByUserId SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {

          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respUserMediaDTO = new this.responseDTO(data) as UserMediaDTO;
              resUserMediaDTOArray.push(respUserMediaDTO);
            });
            resolve(resUserMediaDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resUserMediaDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resUserMediaDTOArray);
          return;
        });
    });
  };

}

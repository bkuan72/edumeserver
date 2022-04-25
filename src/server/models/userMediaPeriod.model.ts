import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { userMediaPeriods_schema, userMediaPeriods_schema_table } from '../../schemas/userMediaPeriods.schema';
import { UserMediaPeriodDataDTO, UserMediaPeriodDTO } from '../../dtos/userMediaPeriods.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import appDbConnection from '../../modules/AppDBModule';

export class UserMediaPeriodModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = userMediaPeriods_schema_table;
    }
    this.requestDTO = UserMediaPeriodDTO;
    this.responseDTO = UserMediaPeriodDataDTO;
    this.schema = userMediaPeriods_schema;
  }

  findByUserId = (
    userId: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resUserMediaPeriodDTOArray: UserMediaPeriodDataDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]);
      appDbConnection.select(sql)
        .then((result) => {

          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respUserMediaPeriodDTO = new this.responseDTO(data) as UserMediaPeriodDataDTO;
              resUserMediaPeriodDTOArray.push(respUserMediaPeriodDTO);
            });
            resolve(resUserMediaPeriodDTOArray);
            return;
          } else {
            resolve(resUserMediaPeriodDTOArray);
          }
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resUserMediaPeriodDTOArray);
          return;
        });
      });
  };

  deleteByUserId = (
    userId: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resUserMediaDTOArray: UserMediaPeriodDataDTO[] = [];
      let sql ='UPDATE ' + this.tableName;
      sql += ' SET status = ' + SqlStr.escape('DELETED')
      sql += ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]);
      appDbConnection.update(sql)
        .then((result) => {
          resolve(resUserMediaDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resUserMediaDTOArray);
          return;
        });
      })
  };

}

import {
  UserMediaFullImageDTO,
  RequestUserMediaDTO
} from '../../dtos/userMedias.DTO';
import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  userMedias_schema,
  userMedias_schema_table
} from '../../schemas/userMedias.schema';
import { UserMediaDTO } from '../../dtos/userMedias.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import appDbConnection from '../../modules/AppDBModule';

export class UserMediaModel extends EntityModel {
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = userMedias_schema_table;
    }
    this.requestDTO = RequestUserMediaDTO;
    this.responseDTO = UserMediaDTO;
    this.schema = userMedias_schema;
  }

  findByUserMediaPeriodId = (userMediaPeriodId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      const resUserMediaDTOArray: UserMediaDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('userMediaPeriod_id = UUID_TO_BIN(?)', [
        userMediaPeriodId
      ]);
      appDbConnection
        .select(sql)
        .then((result) => {
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respUserMediaDTO = new this.responseDTO(
                data
              ) as UserMediaDTO;
              resUserMediaDTOArray.push(respUserMediaDTO);
            });
            resolve(resUserMediaDTOArray);
            return;
          } else {
          resolve(resUserMediaDTOArray);
          }

        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resUserMediaDTOArray);
          return;
        });
    });
  };

  findFullImageById = (userMediaId: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = 'SELECT BIN_TO_UUID(id), fullImage';
      sql += ' FROM ' + this.tableName;
      sql += ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [userMediaId]);
      appDbConnection
        .select(sql)
        .then((result) => {
          if (result.rows.length) {
            const data = {
              id: '',
              fullImage: ''
            };
            const rowData1: any = result.rows[0][0];
            const rowData2: any = result.rows[0][1];
            const blob = SqlFormatter.translatePropValue(
              'BLOB',
              result.rows[0],
              1
            );
            data.id = rowData1;
            data.fullImage = blob;

            const respFullImageDTO = new UserMediaFullImageDTO(data);
            resolve(respFullImageDTO);
            return;
          }
          // not found Customer with the id
          resolve(undefined);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };

  deleteByUserMediaPeriodId = (userMediaPeriodId: string): Promise<any[]> => {
    const resUserMediaDTOArray: UserMediaDTO[] = [];
    return new Promise((resolve) => {
      let sql = 'UPDATE ' + this.tableName;
      sql += ' SET status = ' + SqlStr.escape('DELETED');
      sql += ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('userMediaPeriod_id = UUID_TO_BIN(?)', [
        userMediaPeriodId
      ]);
      appDbConnection
        .update(sql)
        .then((_result) => {
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

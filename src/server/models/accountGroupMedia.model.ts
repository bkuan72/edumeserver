import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { accountGroupMedias_schema, accountGroupMedias_schema_table } from '../../schemas/accountGroupMedias.schema';
import { AccountGroupMediaDTO, AccountGroupMediaFullImageDTO, RequestAccountGroupMediaDTO } from '../../dtos/accountGroupMedias.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import dbConnection from '../../modules/DbModule';

export class AccountGroupMediaModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = accountGroupMedias_schema_table;
    }
    this.requestDTO = RequestAccountGroupMediaDTO;
    this.responseDTO = AccountGroupMediaDTO;
    this.schema = accountGroupMedias_schema;
  }

  findByAccountGroupMediaPeriodId = (
    accountGroupPeriodId: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resAccountGroupMediaDTOArray: AccountGroupMediaDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('accountGroupMediaPeriod_id = UUID_TO_BIN(?)', [accountGroupPeriodId]);
      SysLog.info('findByAccountGroupId SQL: ' + sql);
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
              const respAccountGroupMediaDTO = new this.responseDTO(data) as AccountGroupMediaDTO;
              resAccountGroupMediaDTOArray.push(respAccountGroupMediaDTO);
            });
            resolve(resAccountGroupMediaDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resAccountGroupMediaDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resAccountGroupMediaDTOArray);
          return;
        });
    });
  };
  findFullImageById = (accountGroupMediaId: string): Promise<any | undefined> => {
    return new Promise ((resolve) => {
      let sql = 'SELECT BIN_TO_UUID(id), fullImage';
      sql += ' FROM ' + this.tableName;
      sql += ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [accountGroupMediaId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length) {
          const data = {
            id: '',
            fullImage: ''
          }
          const rowData1: any = result.rows[0][0];
          const blob = SqlFormatter.translatePropValue('BLOB', result.rows[0], 1);
          data.id = rowData1;
          data.fullImage = blob;
          const respFullImageDTO = new AccountGroupMediaFullImageDTO(data);
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
      })
    });
  }
}

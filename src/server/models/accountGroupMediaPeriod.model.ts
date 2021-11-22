import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { accountGroupMediaPeriods_schema, accountGroupMediaPeriods_schema_table } from '../../schemas/accountGroupMediaPeriods.schema';
import { AccountGroupMediaPeriodDTO } from '../../dtos/accountGroupMediaPeriods.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import appDbConnection from '../../modules/AppDBModule';

export class AccountGroupMediaPeriodModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = accountGroupMediaPeriods_schema_table;
    }
    this.requestDTO = AccountGroupMediaPeriodDTO;
    this.responseDTO = AccountGroupMediaPeriodDTO;
    this.schema = accountGroupMediaPeriods_schema;
  }

  findByAccountId = (
    accountId: string,
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resAccountGroupMediaPeriodDTOArray: AccountGroupMediaPeriodDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('account_id = UUID_TO_BIN(?)', [accountId]) + ' AND ';
      sql += 'group_id = 0 ';
      SysLog.info('findByAccountGroupId SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
        DBSession.sql(sql)
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
              const respAccountGroupMediaPeriodDTO = new this.responseDTO(data) as AccountGroupMediaPeriodDTO;
              resAccountGroupMediaPeriodDTOArray.push(respAccountGroupMediaPeriodDTO);
            });
            resolve(resAccountGroupMediaPeriodDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resAccountGroupMediaPeriodDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resAccountGroupMediaPeriodDTOArray);
          return;
        });
      });
    });
  };


  findByGroupId = (
    groupId: string,
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resAccountGroupMediaPeriodDTOArray: AccountGroupMediaPeriodDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('group_id = UUID_TO_BIN(?)', [groupId]);
      SysLog.info('findByAccountGroupId SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
        DBSession.sql(sql)
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
              const respAccountGroupMediaPeriodDTO = new this.responseDTO(data) as AccountGroupMediaPeriodDTO;
              resAccountGroupMediaPeriodDTOArray.push(respAccountGroupMediaPeriodDTO);
            });
            resolve(resAccountGroupMediaPeriodDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resAccountGroupMediaPeriodDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resAccountGroupMediaPeriodDTOArray);
          return;
        });
      });
    });
  };

}

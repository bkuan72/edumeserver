import { users_schema_table } from './../../schemas/users.schema';
import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { accountGroupMembers_schema, accountGroupMembers_schema_table } from '../../schemas/accountGroupMembers.schema';
import { AccountGroupMemberDTO, AccountGroupMemberListDTO } from '../../dtos/accountGroupMembers.DTO';
import { EntityModel } from './entity.model';
import dbConnection from '../../modules/DbModule';
import SysLog from '../../modules/SysLog';
import SqlStr = require('sqlstring');

export class AccountGroupMemberModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = accountGroupMembers_schema_table;
    }
    this.requestDTO = AccountGroupMemberDTO;
    this.responseDTO = AccountGroupMemberDTO;
    this.schema = accountGroupMembers_schema;
  }

  findByUserId = (userId: string): Promise<any[]> => {
    return new Promise ((resolve) => {
      const resAccountGroupMemberDTOArray: AccountGroupMemberDTO[] = [];
      let sql =
      SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {

        if (result.rows.length) {

            result.rows.forEach ((rowData) => {
                const data = SqlFormatter.transposeResultSet(this.schema,
                undefined,
                undefined,
                rowData);
                const respAccountGroupMemberDTO = new this.responseDTO(data) as AccountGroupMemberDTO;
                resAccountGroupMemberDTOArray.push(respAccountGroupMemberDTO);
            });
          resolve(resAccountGroupMemberDTOArray);
          return;
        }
        // not found Customer with the id
        resolve(resAccountGroupMemberDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(resAccountGroupMemberDTOArray);
        return;
      })

    });
  };

  getAccountMemberList = (accountId: string): Promise<any[]> => {
    return new Promise ((resolve) => {
      const resAccountGroupMemberListDTOArray: AccountGroupMemberListDTO[] = [];
      let sql = '';
      sql = 'SELECT BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'id') + '), ';
      sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + '), ';
      sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') + '), ';
      sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') + '), ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'user_name') + ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'avatar') + ',';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'accountGroupMember_date');
      sql += ' FROM ' + this.tableName + ', ' + users_schema_table;
      sql += ' WHERE ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + SqlStr.format(' = ?', [this.siteCode]) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ' != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') + SqlStr.format(' = UUID_TO_BIN(?)', [accountId]) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'id') + ' = ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id');
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {

        if (result.rows.length) {

            result.rows.forEach ((rowData) => {
                const data = SqlFormatter.transposeColumnResultSet([
                    'id',
                    'user_id',
                    'account_id',
                    'group_id',
                    'name',
                    'avatar',
                    'since'
                ],
                rowData);
                resAccountGroupMemberListDTOArray.push(data);
            });
          resolve(resAccountGroupMemberListDTOArray);
          return;
        }
        // not found Customer with the id
        resolve(resAccountGroupMemberListDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(resAccountGroupMemberListDTOArray);
        return;
      })

    });
  };

  getGroupMemberList = (groupId: string): Promise<any[]> => {
    return new Promise ((resolve) => {
      const resAccountGroupMemberListDTOArray: AccountGroupMemberListDTO[] = [];
      let sql = '';
      sql = 'SELECT BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'id') + '), ';
      sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + '), ';
      sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') + '), ';
      sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') + '), ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'user_name') + ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'avatar') + ',';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'accountGroupMember_date');
      sql += ' FROM ' + this.tableName + ', ' + users_schema_table;
      sql += ' WHERE ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + SqlStr.format(' = ?', [this.siteCode]) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ' != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') + SqlStr.format(' = UUID_TO_BIN(?)', [groupId]) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'id') + ' = ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id');
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {

        if (result.rows.length) {

            result.rows.forEach ((rowData) => {
                const data = SqlFormatter.transposeColumnResultSet([
                    'id',
                    'user_id',
                    'account_id',
                    'group_id',
                    'name',
                    'avatar',
                    'since'
                ],
                rowData);
                resAccountGroupMemberListDTOArray.push(data);
            });
          resolve(resAccountGroupMemberListDTOArray);
          return;
        }
        // not found Customer with the id
        resolve(resAccountGroupMemberListDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(resAccountGroupMemberListDTOArray);
        return;
      })

    });
  };
}

import { accounts_schema } from './../../schemas/accounts.schema';
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection from '../../modules/DbModule';
import { UserAccountsData, userAccounts_schema, userAccounts_schema_table } from '../../schemas/userAccounts.schema';
import { uuidIfc } from './uuidIfc';
import { UserAccountDataDTO, UserAccountsDTO } from '../../dtos/userAccounts.DTO';
import SysLog from '../../modules/SysLog';
import SysEnv from '../../modules/SysEnv';
import { accounts_schema_table } from '../../schemas/accounts.schema';
import { EntityModel } from './entity.model';

export class UserAccountModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = userAccounts_schema_table;
    }
    this.requestDTO = UserAccountsDTO;
    this.responseDTO = UserAccountsDTO;
    this.schema = userAccounts_schema;
  }

  /**
   * Function returns an array of user account types
   * respDTO
   * [{
   *  account_type: string,
   *  user_id: string,
   *  id: string
   * }]
   * @param siteCode - website site_code
   * @param userId   - user.id
   * @param status   - status of user_account
   */
  getUserAccountTypes = async (siteCode: string, userId: string, status: string): Promise<any[]> => {
    return new Promise((resolve) => {
      const userAccountTypes: any[] = [];
      let sql = 'SELECT ' + accounts_schema_table+ '.account_type';
      sql += ', BIN_TO_UUID(' + userAccounts_schema_table +'.user_id)';
      sql += ', BIN_TO_UUID(' + userAccounts_schema_table +'.id)';
      sql += ' FROM '+ userAccounts_schema_table;
      sql += ' INNER JOIN ' + accounts_schema_table + ' ON ' + userAccounts_schema_table + '.account_id = ' + accounts_schema_table + '.id'
      sql += ' WHERE ' + userAccounts_schema_table+ '.site_code = ' + SqlStr.escape(siteCode) + ' AND ';
      sql += userAccounts_schema_table+ '.status = ' + SqlStr.escape(status) + ' AND ';
      sql += SqlStr.format(userAccounts_schema_table+ '.user_id = UUID_TO_BIN(?);', [userId]);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length == 0) {
          // not found Customer with the id
          resolve(userAccountTypes);
          return;
        }
        SysLog.info('get user accounts with id: ', userId);
        result.rows.forEach(data => {
          const userAccount = SqlFormatter.transposeColumnResultSet(
            ['account_type',
            'user_id',
            'id'],
            data
          )
          userAccountTypes.push(userAccount);
        });
        resolve(userAccountTypes);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(userAccountTypes);
        return;
      });
    });
  };


  getUserAccounts = async (siteCode: string, userId: string, status: string): Promise<any[]> => {
    return new Promise((resolve) => {
      const userAccountTypes: any[] = [];
      let sql = 'SELECT ' + SqlFormatter.formatTableSelect(accounts_schema_table, 
                                                           accounts_schema,
                                                           ['id']);
      sql += ', BIN_TO_UUID(' + userAccounts_schema_table +'.user_id)';
      sql += ', BIN_TO_UUID(' + userAccounts_schema_table +'.account_id)';
      sql += ', BIN_TO_UUID(' + userAccounts_schema_table +'.id)';
      sql += ' FROM '+ userAccounts_schema_table;
      sql += ' INNER JOIN ' + accounts_schema_table + ' ON ' + userAccounts_schema_table + '.account_id = ' + accounts_schema_table + '.id'
      sql += ' WHERE ' + userAccounts_schema_table+ '.site_code = ' + SqlStr.escape(siteCode) + ' AND ';
      sql += userAccounts_schema_table+ '.status = ' + SqlStr.escape(status) + ' AND ';
      sql += SqlStr.format(userAccounts_schema_table+ '.user_id = UUID_TO_BIN(?);', [userId]);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length == 0) {
          // not found Customer with the id
          resolve(userAccountTypes);
          return;
        }
        SysLog.info('get user accounts with id: ', userId);
        result.rows.forEach(rowData => {
          const userAccountDataDTO = new UserAccountDataDTO() as UserAccountsData
          let colIdx = 0;
          colIdx = SqlFormatter.transposeTableSelectColumns(colIdx,
                                                            userAccountDataDTO,
                                                            accounts_schema,
                                                            rowData,
                                                            ['id']);
          colIdx = SqlFormatter.transposeTableSelectColumnArray(
            colIdx,
            userAccountDataDTO,
            [
            'user_id',
            'account_id',
            'user_account_id'
            ],
            rowData
          )
          userAccountTypes.push(userAccountDataDTO);
        });
        resolve(userAccountTypes);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(userAccountTypes);
        return;
      });
    });
  };
}

export default UserAccountModel;

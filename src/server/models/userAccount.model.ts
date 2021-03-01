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

export class UserAccountModel {

  siteCode = SysEnv.SITE_CODE;
  constructor() {
    this.siteCode = SysEnv.SITE_CODE;
  }

  tableName = userAccounts_schema_table;
  create = (userAccount: any): Promise<UserAccountsDTO | undefined> => {
    const newUserAccount =  new UserAccountsDTO(userAccount) as UserAccountsData;
    newUserAccount.site_code = this.siteCode;
    return new Promise (async (resolve) => {
     SqlFormatter.formatInsert(
        newUserAccount,
        this.tableName,
        userAccounts_schema
      ).then((sql) => {
        dbConnection.DB.sql('SET @uuidId=UUID(); ').execute()
        .then((result) => {
          dbConnection.DB.sql(sql).execute()
          .then((result2) => {
            dbConnection.DB.sql('SELECT @uuidId;').execute()
            .then((result3) => {
              SysLog.info('created Entity: ', result3);
              const newUuid: uuidIfc = { '@uuidId': result3.rows[0][0] }; // TODO

              const respUserAccountsDTO = new UserAccountsDTO(newUserAccount) as UserAccountsData;
              respUserAccountsDTO.password = '';
              respUserAccountsDTO.id = newUuid['@uuidId'];
              resolve(respUserAccountsDTO)
            })
            .catch((err) => {
              SysLog.error(JSON.stringify(err));
              resolve(undefined);
              return;
            });
          })
          .catch((err) => {
            SysLog.error(JSON.stringify(err));
            resolve(undefined);
            return;
          });
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
      });
    });

  };

  findById = (userAccountId: string): Promise<UserAccountsDTO | undefined> => {
    return new Promise ((resolve) => {
      let sql =
      SqlFormatter.formatSelect(this.tableName, userAccounts_schema) + ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [userAccountId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length) {
          const data = SqlFormatter.transposeResultSet(userAccounts_schema,
            undefined,
            undefined,
            result.rows[0]);
          const respUserAccountsDTO = new UserAccountsDTO(data);
          resolve(respUserAccountsDTO);
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

  find = (conditions: any,
          ignoreExclSelect?: boolean,
          excludeSelectProp?: string[]): Promise<UserAccountsDTO[] | UserAccountsData[]> => {
    const respUserAccountsDTOArray:UserAccountsDTO[] = [];
    let sql = SqlFormatter.formatSelect(this.tableName, userAccounts_schema, ignoreExclSelect, excludeSelectProp);
    sql += SqlFormatter.formatWhereAND('', conditions, this.tableName, userAccounts_schema) + ' AND ';
    sql = SqlFormatter.formatWhereAND(sql, {site_code: this.siteCode}, this.tableName, userAccounts_schema);
    SysLog.info('find SQL: ' + sql);
    return new Promise((resolve) => {
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length) {
          const respUserAccountsDTOArray:UserAccountsDTO[] = [];
          result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeResultSet(userAccounts_schema,
              ignoreExclSelect,
              excludeSelectProp,
              rowData);
            const respUserAccountsDTO = new UserAccountsDTO(data);
            respUserAccountsDTOArray.push(respUserAccountsDTO);
          });
          resolve (respUserAccountsDTOArray);
          return;
        }
        // not found with the id
        resolve(respUserAccountsDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve (respUserAccountsDTOArray);
        return;
      });
    });
  };

  getAll = (): Promise<UserAccountsDTO[]> => {
    return new Promise ((resolve) => {
      const respUserAccountsDTOArray:UserAccountsDTO[] = [];
      let sql = SqlFormatter.formatSelect(this.tableName, userAccounts_schema);
      sql += SqlFormatter.formatWhereAND('', {site_code: this.siteCode}, this.tableName, userAccounts_schema);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length) {

          result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeResultSet(userAccounts_schema,
              undefined,
              undefined,
              rowData);
            const respUserAccountsDTO = new UserAccountsDTO(data);
            respUserAccountsDTOArray.push(respUserAccountsDTO);
          });
          resolve (respUserAccountsDTOArray);
          return;
        }
        // not found
        resolve(respUserAccountsDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(respUserAccountsDTOArray);
        return;
      });
    });
  };

  updateById = async (userAccountId: string, UserAccountsDTO: any): Promise<UserAccountsDTO | undefined> => {
    return new Promise ((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, userAccounts_schema, UserAccountsDTO).then ((sql) => {
        sql += SqlFormatter.formatWhereAND('', {id: userAccountId}, this.tableName, userAccounts_schema);
        dbConnection.DB.sql(sql).execute()
        .then((result) => {
          SysLog.info('updated userAccount: ', { id: userAccountId, ...UserAccountsDTO });
          this.findById(userAccountId).then((respUserAccountsDTO) => {
            resolve(respUserAccountsDTO);
          })
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
      });
    });
  };

  remove = (id: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = 'DELETE FROM '+ userAccounts_schema_table +' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [id]);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        SysLog.info('deleted entities with id: ', id);
        resolve({
          deleted_id: id
        });
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    });
  };

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

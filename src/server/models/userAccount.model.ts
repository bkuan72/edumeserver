/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection from '../../modules/DbModule';
import { userAccounts_schema, userAccounts_schema_table } from '../../schemas/userAccounts.schema';
import { uuidIfc } from './uuidIfc';
import { UserAccountsDTO } from '../../dtos/userAccounts.DTO';
import SysLog from '../../modules/SysLog';
import SysEnv from '../../modules/SysEnv';

export class UserAccountModel {

  siteCode = SysEnv.SITE_CODE;
  constructor() {
    this.siteCode = SysEnv.SITE_CODE;
  }

  tableName = userAccounts_schema_table;
  create = (userAccount: any): Promise<UserAccountsDTO | undefined> => {
    const newUserAccount =  new UserAccountsDTO(userAccount);
    newUserAccount.data.site_code = this.siteCode;
    return new Promise (async (resolve) => {
     SqlFormatter.formatInsert(
        newUserAccount.data,
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

              const respUserAccountsDTO = new UserAccountsDTO(newUserAccount);
              respUserAccountsDTO.data.password = '';
              respUserAccountsDTO.data.id = newUuid['@uuidId'];
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
          excludeSelectProp?: string[]): Promise<UserAccountsDTO[] | undefined> => {
    let sql = SqlFormatter.formatSelect(this.tableName, userAccounts_schema, ignoreExclSelect, excludeSelectProp);
    sql += SqlFormatter.formatWhereAND('', conditions, userAccounts_schema);
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
        resolve(undefined);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve (undefined);
        return;
      });
    });
  };

  getAll = (): Promise<UserAccountsDTO[] | undefined> => {
    return new Promise ((resolve) => {
      dbConnection.DB.sql(SqlFormatter.formatSelect(this.tableName, userAccounts_schema)).execute()
      .then((result) => {
        if (result.rows.length) {
          const respUserAccountsDTOArray:UserAccountsDTO[] = [];
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
        resolve(undefined);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    });
  };

  updateById = async (userAccountId: string, UserAccountsDTO: any): Promise<UserAccountsDTO | undefined> => {
    return new Promise ((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, userAccounts_schema, UserAccountsDTO).then ((sql) => {
        sql += SqlFormatter.formatWhereAND('', {id: userAccountId}, userAccounts_schema);
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

  remove = (id: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
      let sql = 'DELETE FROM userAccounts WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [id]);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length == 0) {
          // not found Customer with the id
          resolve(undefined);
          return;
        }
        SysLog.info('deleted entities with id: ', id);
        resolve(id);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    });
  };
}

export default UserAccountModel;

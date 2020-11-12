/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection from '../../modules/DbModule';
import { userAccounts_schema } from '../../schemas/userAccounts.schema';
import { uuidIfc } from './uuidIfc';
import { UserAccountsDTO } from '../../dtos/userAccounts.DTO';
import SysLog from '../../modules/SysLog';

export class UserAccountModel {

  tableName = 'userAccounts';
  create = (newUserAccount: UserAccountsDTO): Promise<UserAccountsDTO | undefined> => {
    return new Promise (async (resolve) => {
     SqlFormatter.formatInsert(
        newUserAccount.data,
        this.tableName,
        userAccounts_schema
      ).then((sql) => {
        dbConnection.DB.query('SET @uuidId=UUID(); ', (err: any, res: any) => {
          if (err) {
            SysLog.error(JSON.stringify(err));
            resolve(undefined)
            return;
          }
          dbConnection.DB.query(sql, (err: any, res: any) => {
            if (err) {
              SysLog.error(JSON.stringify(err));
            }
            dbConnection.DB.query('SELECT @uuidId;', (err: any, res: uuidIfc[]) => {
              if (err) {
                SysLog.error(JSON.stringify(err));
                resolve(undefined)
                return;
              }
              SysLog.info('created userAccount: ', res);
              const newUuid: uuidIfc = res[0];
              const respUserAccountsDTO = new UserAccountsDTO(newUserAccount.data);
              respUserAccountsDTO.data.password = '';
              respUserAccountsDTO.data.id = newUuid['@uuidId'];
              resolve(respUserAccountsDTO)
            });
          });
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
      dbConnection.DB.query(sql, (err, res) => {
        if (err) {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        }
        if (res.length) {
          const respUserAccountsDTO = new UserAccountsDTO(res[0]);
          resolve(respUserAccountsDTO);
          return;
        }
        // not found Customer with the id
        resolve(undefined);
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
      dbConnection.DB.query(sql, (err, res) => {
        if (err) {
          SysLog.error(JSON.stringify(err));
          resolve (undefined);
          return;
        }
        if (res.length) {
          const respUserAccountsDTOArray:UserAccountsDTO[] = [];
          res.forEach((data: any) => {
            const respUserAccountsDTO = new UserAccountsDTO(data);
            respUserAccountsDTOArray.push(respUserAccountsDTO);
          });
          resolve (respUserAccountsDTOArray);
          return;
        }
        // not found with the id
        resolve(undefined);
      });

    });
  };

  getAll = (): Promise<UserAccountsDTO[] | undefined> => {
    return new Promise ((resolve) => {
      dbConnection.DB.query(
        SqlFormatter.formatSelect(this.tableName, userAccounts_schema),
        (err, res) => {
          if (err) {
            SysLog.error(JSON.stringify(err));
            resolve(undefined);
            return;
          }
          if (res.length) {
            const respUserAccountsDTOArray:UserAccountsDTO[] = [];
            res.forEach((data: any) => {
              const respUserAccountsDTO = new UserAccountsDTO(data);
              respUserAccountsDTOArray.push(respUserAccountsDTO);
            });
            resolve (respUserAccountsDTOArray);
            return;
          }
          // not found
          resolve(undefined);
        }
      );
    });
  };

  updateById = async (userAccountId: string, UserAccountsDTO: any): Promise<UserAccountsDTO | undefined> => {
    return new Promise ((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, userAccounts_schema, UserAccountsDTO).then ((sql) => {
        sql += SqlFormatter.formatWhereAND('', {id: userAccountId}, userAccounts_schema);
        dbConnection.DB.query( sql,
          (err, res) => {
            if (err) {
              SysLog.error(JSON.stringify(err));
              resolve(undefined);
              return;
            }
            if (res.affectedRows == 0) {
              // not found userAccount with the id
              resolve(undefined);
              return;
            }
            SysLog.info('updated userAccount: ', { id: userAccountId, ...UserAccountsDTO });
            this.findById(userAccountId).then((respUserAccountsDTO) => {
              resolve(respUserAccountsDTO);
            })
          }
        );
      });
      });
  };

  remove = (id: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
      dbConnection.DB.query(
        'DELETE FROM userAccounts WHERE id = UUID_TO_BIN(?);',
        id,
        (err, res) => {
          if (err) {
            SysLog.error(JSON.stringify(err));
            resolve(undefined);
            return;
          }
          if (res.affectedRows == 0) {
            // not found Customer with the id
            resolve(undefined);
            return;
          }
          SysLog.info('deleted userAccounts with id: ', id);
          resolve(id);
        }
      );
    });
  };
}

export default UserAccountModel;

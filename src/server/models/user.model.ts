/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection from '../../modules/DbModule';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';
import { ResponseUserDTO } from '../../dtos/ResponseUserDTO';
import { users_schema } from '../../schemas/users.schema';
import { uuidIfc } from './uuidIfc';
import SysLog from '../../modules/SysLog';

export class UserModel {

  tableName = 'users';
  create = (newUser: CreateUserDTO): Promise<ResponseUserDTO | undefined> => {
    return new Promise (async (resolve) => {
     SqlFormatter.formatInsert(
        newUser.data,
        this.tableName,
        users_schema
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
              SysLog.info('created user: ', res);
              const newUuid: uuidIfc = res[0];
              const respUserDTO = new ResponseUserDTO(newUser.data);
              respUserDTO.data.password = '';
              respUserDTO.data.id = newUuid['@uuidId'];
              resolve(respUserDTO)
            });
          });
        });
      });
    });

  };

  findById = (userId: string): Promise<ResponseUserDTO | undefined> => {
    return new Promise ((resolve) => {
      let sql =
      SqlFormatter.formatSelect(this.tableName, users_schema) + ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [userId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.query(sql, (err, res) => {
        if (err) {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        }
        if (res.length) {
          const respUserDTO = new ResponseUserDTO(res[0]);
          resolve(respUserDTO);
          return;
        }
        // not found Customer with the id
        resolve(undefined);
      });

    });
  };

  find = (conditions: any,
          showPassword?: boolean,
          ignoreExclSelect?: boolean, 
          excludeSelectProp?: string[]): Promise<ResponseUserDTO[] | undefined> => {
    let sql = SqlFormatter.formatSelect(this.tableName, users_schema, ignoreExclSelect, excludeSelectProp);
    sql += SqlFormatter.formatWhereAND('', conditions, users_schema);
    SysLog.info('find SQL: ' + sql);
    return new Promise((resolve) => {
      dbConnection.DB.query(sql, (err, res) => {
        if (err) {
          SysLog.error(JSON.stringify(err));
          resolve (undefined);
          return;
        }
        if (res.length) {
          const respUserDTOArray:ResponseUserDTO[] = [];
          res.forEach((data: any) => {
            const respUserDTO = new ResponseUserDTO(data, showPassword);
            respUserDTOArray.push(respUserDTO);
          });
          resolve (respUserDTOArray);
          return;
        }
        // not found with the id
        resolve(undefined);
      });

    });
  };

  getAll = (): Promise<ResponseUserDTO[] | undefined> => {
    return new Promise ((resolve) => {
      dbConnection.DB.query(
        SqlFormatter.formatSelect(this.tableName, users_schema),
        (err, res) => {
          if (err) {
            SysLog.error(JSON.stringify(err));
            resolve(undefined);
            return;
          }
          if (res.length) {
            const respUserDTOArray:ResponseUserDTO[] = [];
            res.forEach((data: any) => {
              const respUserDTO = new ResponseUserDTO(data);
              respUserDTOArray.push(respUserDTO);
            });
            resolve (respUserDTOArray);
            return;
          }
          // not found
          resolve(undefined);
        }
      );
    });
  };

  updateById = async (userId: string, userDTO: any): Promise<ResponseUserDTO | undefined> => {
    return new Promise ((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, users_schema, userDTO).then ((sql) => {
        sql += SqlFormatter.formatWhereAND('', {id: userId}, users_schema);
        dbConnection.DB.query( sql,
          (err, res) => {
            if (err) {
              SysLog.error(JSON.stringify(err));
              resolve(undefined);
              return;
            }
            if (res.affectedRows == 0) {
              // not found user with the id
              resolve(undefined);
              return;
            }
            SysLog.info('updated user: ', { id: userId, ...userDTO });
            this.findById(userId).then((respUserDTO) => {
              resolve(respUserDTO);
            })
          }
        );
      });
      });
  };

  remove = (id: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
      dbConnection.DB.query(
        'DELETE FROM users WHERE id = UUID_TO_BIN(?);',
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
          SysLog.info('deleted users with id: ', id);
          resolve(id);
        }
      );
    });
  };
}

export default UserModel;

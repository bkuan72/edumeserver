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
import { users_schema, users_schema_table } from '../../schemas/users.schema';
import { uuidIfc } from './uuidIfc';
import SysLog from '../../modules/SysLog';
import { Column, Metadata, Row } from 'mysqlx/lib/types';
import SysEnv from '../../modules/SysEnv';

export class UserModel {

  tableName = users_schema_table;
  siteCode = SysEnv.SITE_CODE;


  constructor () {
    this.siteCode = SysEnv.SITE_CODE;
  }
  create = (userData: any): Promise<ResponseUserDTO | undefined> => {
    const newUser = new CreateUserDTO(userData);
    newUser.data.site_code = this.siteCode;

    return new Promise (async (resolve) => {
     SqlFormatter.formatInsert(
        newUser.data,
        this.tableName,
        users_schema
      ).then((sql) => {

        dbConnection.DB.sql('SET @uuidId=UUID(); ').execute()
        .then((result) => {
          dbConnection.DB.sql(sql).execute()
          .then((result2) => {
            dbConnection.DB.sql('SELECT @uuidId;').execute()
            .then((result3) => {
              SysLog.info('created Entity: ', result3);
              const newUuid: uuidIfc = { '@uuidId': result3.rows[0][0] }; // TODO
              const respUserDTO = new ResponseUserDTO(newUser.data);
              respUserDTO.data.password = '';
              respUserDTO.data.id = newUuid['@uuidId'];
              resolve(respUserDTO)
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
          resolve(undefined)
          return;
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
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length) {
          const data = SqlFormatter.transposeResultSet(users_schema,
            undefined,
            undefined,
            result.rows[0]);
          const respUserDTO = new ResponseUserDTO(data);
          resolve(respUserDTO);
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
          showPassword?: boolean,
          ignoreExclSelect?: boolean,
          excludeSelectProp?: string[]): Promise<ResponseUserDTO[] | undefined> => {
    let sql = SqlFormatter.formatSelect(this.tableName, users_schema, ignoreExclSelect, excludeSelectProp);
    sql += SqlFormatter.formatWhereAND('', conditions, this.tableName, users_schema);
    SysLog.info('find SQL: ' + sql);
    return new Promise((resolve) => {
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        const respUserDTOArray:ResponseUserDTO[] = [];
        if (result.rows.length) {

          result.rows.forEach((rowData: any[]) => {
            const data = SqlFormatter.transposeResultSet(users_schema,
                                                        ignoreExclSelect,
                                                        excludeSelectProp,
                                                        rowData);
            const respUserDTO = new ResponseUserDTO(data, showPassword);
            respUserDTOArray.push(respUserDTO);
          });
          resolve (respUserDTOArray);
          return;
        }
        // not found with the id
        resolve(respUserDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve (undefined);
        return;
      });
    });
  };

  getAll = (): Promise<ResponseUserDTO[] | undefined> => {
    return new Promise ((resolve) => {
      dbConnection.DB.sql(SqlFormatter.formatSelect(this.tableName, users_schema)).execute()
      .then((result) => {
        const respUserDTOArray:ResponseUserDTO[] = [];
        if (result.rows.length) {

          result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeResultSet(users_schema,
              undefined,
              undefined,
              rowData);
            const respUserDTO = new ResponseUserDTO(data);
            respUserDTOArray.push(respUserDTO);
          });
          resolve (respUserDTOArray);
          return;
        }
        // not found
        resolve(respUserDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    });
  };

  updateById = async (userId: string, userDTO: any): Promise<ResponseUserDTO | undefined> => {
    return new Promise ((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, users_schema, userDTO).then ((sql) => {
        sql += SqlFormatter.formatWhereAND('', {id: userId}, this.tableName, users_schema);
        dbConnection.DB.sql(sql).execute()
        .then((result) => {
          SysLog.info('updated user: ', { id: userId, ...userDTO });
          this.findById(userId).then((respUserDTO) => {
            resolve(respUserDTO);
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
      let sql = 'DELETE FROM users WHERE ';
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

export default UserModel;

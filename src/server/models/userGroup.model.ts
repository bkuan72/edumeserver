import { socialGroups_schema_table } from './../../schemas/groups.schema';
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection from '../../modules/DbModule';
import {
  userGroups_schema,
  userGroups_schema_table
} from '../../schemas/userGroups.schema';
import { uuidIfc } from './uuidIfc';
import { UserGroupInfoDTO, UserGroupsDTO } from '../../dtos/userGroups.DTO';
import SysLog from '../../modules/SysLog';
import SysEnv from '../../modules/SysEnv';

export class UserGroupModel {
  siteCode = SysEnv.SITE_CODE;
  constructor() {
    this.siteCode = SysEnv.SITE_CODE;
  }

  tableName = userGroups_schema_table;
  create = (userGroup: any): Promise<UserGroupsDTO | undefined> => {
    const newUserGroup = new UserGroupsDTO(userGroup);
    newUserGroup.data.site_code = this.siteCode;
    return new Promise(async (resolve) => {
      SqlFormatter.formatInsert(
        newUserGroup.data,
        this.tableName,
        userGroups_schema
      ).then((sql) => {
        dbConnection.DB.sql('SET @uuidId=UUID(); ')
          .execute()
          .then((result) => {
            dbConnection.DB.sql(sql)
              .execute()
              .then((result2) => {
                dbConnection.DB.sql('SELECT @uuidId;')
                  .execute()
                  .then((result3) => {
                    SysLog.info('created Entity: ', result3);
                    const newUuid: uuidIfc = { '@uuidId': result3.rows[0][0] }; // TODO

                    const respUserGroupsDTO = new UserGroupsDTO(newUserGroup);
                    respUserGroupsDTO.data.password = '';
                    respUserGroupsDTO.data.id = newUuid['@uuidId'];
                    resolve(respUserGroupsDTO);
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

  findById = (userGroupId: string): Promise<UserGroupsDTO | undefined> => {
    return new Promise((resolve) => {
      let sql =
        SqlFormatter.formatSelect(this.tableName, userGroups_schema) +
        ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [userGroupId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            const data = SqlFormatter.transposeResultSet(
              userGroups_schema,
              undefined,
              undefined,
              result.rows[0]
            );
            const respUserGroupsDTO = new UserGroupsDTO(data);
            resolve(respUserGroupsDTO);
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

  find = (
    conditions: any,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[]
  ): Promise<UserGroupsDTO[] | undefined> => {
    let sql = SqlFormatter.formatSelect(
      this.tableName,
      userGroups_schema,
      ignoreExclSelect,
      excludeSelectProp
    );
    sql += SqlFormatter.formatWhereAND('', conditions, this.tableName, userGroups_schema);
    SysLog.info('find SQL: ' + sql);
    return new Promise((resolve) => {
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            const respUserGroupsDTOArray: UserGroupsDTO[] = [];
            result.rows.forEach((rowData: any) => {
              const data = SqlFormatter.transposeResultSet(
                userGroups_schema,
                ignoreExclSelect,
                excludeSelectProp,
                rowData
              );
              const respUserGroupsDTO = new UserGroupsDTO(data);
              respUserGroupsDTOArray.push(respUserGroupsDTO);
            });
            resolve(respUserGroupsDTOArray);
            return;
          }
          // not found with the id
          resolve(undefined);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };

  getAll = (): Promise<UserGroupsDTO[] | undefined> => {
    return new Promise((resolve) => {
      dbConnection.DB.sql(
        SqlFormatter.formatSelect(this.tableName, userGroups_schema)
      )
        .execute()
        .then((result) => {
          if (result.rows.length) {
            const respUserGroupsDTOArray: UserGroupsDTO[] = [];
            result.rows.forEach((rowData: any) => {
              const data = SqlFormatter.transposeResultSet(
                userGroups_schema,
                undefined,
                undefined,
                rowData
              );
              const respUserGroupsDTO = new UserGroupsDTO(data);
              respUserGroupsDTOArray.push(respUserGroupsDTO);
            });
            resolve(respUserGroupsDTOArray);
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

  updateById = async (
    userGroupId: string,
    UserGroupsDTO: any
  ): Promise<UserGroupsDTO | undefined> => {
    return new Promise((resolve) => {
      SqlFormatter.formatUpdate(
        this.tableName,
        userGroups_schema,
        UserGroupsDTO
      ).then((sql) => {
        sql += SqlFormatter.formatWhereAND(
          '',
          { id: userGroupId },
          this.tableName,
          userGroups_schema
        );
        dbConnection.DB.sql(sql)
          .execute()
          .then((result) => {
            SysLog.info('updated userGroup: ', {
              id: userGroupId,
              ...UserGroupsDTO
            });
            this.findById(userGroupId).then((respUserGroupsDTO) => {
              resolve(respUserGroupsDTO);
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

  remove = (id: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = 'DELETE FROM userGroups WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [id]);
      dbConnection.DB.sql(sql)
        .execute()
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

  findByUserId = (
    userId: string,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[]
  ): Promise<UserGroupInfoDTO[] | undefined> => {
    let sql = 'SELECT BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'id') + '), ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ', ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') + '), ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + '), ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'join_date') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'group_name') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'category') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'lastUpdateUsec');
    sql += ' FROM ' + this.tableName + ', ' + socialGroups_schema_table;
    sql += ' WHERE ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + SqlStr.format(' = ?', [this.siteCode]) + ' AND ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + SqlStr.format(' = UUID_TO_BIN(?)', [userId]) + ' AND ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'id') + ' = ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id');

    SysLog.info('findById SQL: ' + sql);
    SysLog.info('find SQL: ' + sql);
    return new Promise((resolve) => {
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          const respUserGroupsDTOArray: UserGroupInfoDTO[] = [];
          if (result.rows.length) {
            result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeColumnResultSet([
                'id',
                'status',
                'group_id',
                'user_id',
                'join_date',
                'name',
                'category',
                'lastUpdateUsec'
            ],
            rowData) as UserGroupInfoDTO;
              respUserGroupsDTOArray.push(data);
            });
            resolve(respUserGroupsDTOArray);
            return;
          }
          // not found with the id
          resolve(respUserGroupsDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };
}

export default UserGroupModel;

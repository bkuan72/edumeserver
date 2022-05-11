import { socialGroups_schema_table } from '../../schemas/groups.schema';
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import appDbConnection from '../../modules/AppDBModule';
import {
  userGroups_schema,
  userGroups_schema_table
} from '../../schemas/userGroups.schema';
import { UserGroupInfoDTO, UserGroupsDTO } from '../../dtos/userGroups.DTO';
import SysLog from '../../modules/SysLog';
import { EntityModel } from './entity.model';

export class UserGroupModel extends EntityModel {

  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = userGroups_schema_table;
    }
    this.requestDTO = UserGroupsDTO;
    this.responseDTO = UserGroupInfoDTO;
    this.schema = userGroups_schema;
  }
  findByUserId = (
    userId: string,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[]
  ): Promise<UserGroupInfoDTO[]> => {
    const respUserGroupsDTOArray: UserGroupInfoDTO[] = [];
    let sql = 'SELECT BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'id') + '), ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ', ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') + '), ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') + '), ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + '), ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'join_date') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'group_name') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'category') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'last_update_usec');
    sql += ' FROM ' + this.tableName + ', ' + socialGroups_schema_table;
    sql += ' WHERE ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + SqlStr.format(' = ?', [this.siteCode]) + ' AND ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + SqlStr.format(' = UUID_TO_BIN(?)', [userId]) + ' AND ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'id') + ' = ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id');

    return new Promise((resolve) => {
      appDbConnection.select(sql)
        .then((result) => {

          if (result.rows.length) {
            result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeColumnResultSet([
                'id',
                'status',
                'account_id',
                'group_id',
                'user_id',
                'join_date',
                'name',
                'category',
                'last_update_usec'
            ],
            rowData) as UserGroupInfoDTO;
              respUserGroupsDTOArray.push(data);
            });
            resolve(respUserGroupsDTOArray);
            return;
          } else {
          // not found with the id
          resolve(respUserGroupsDTOArray);
          }

        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(respUserGroupsDTOArray);
          return;
        });
      });
   };


  findByAccountId = (
    accountId: string,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[]
  ): Promise<UserGroupInfoDTO[]> => {
    let sql = 'SELECT BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'id') + '), ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ', ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') + '), ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') + '), ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + '), ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'join_date') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'group_name') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'category') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'last_update_usec');
    sql += ' FROM ' + this.tableName + ', ' + socialGroups_schema_table;
    sql += ' WHERE ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + SqlStr.format(' = ?', [this.siteCode]) + ' AND ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') + SqlStr.format(' = UUID_TO_BIN(?)', [accountId]) + ' AND ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'id') + ' = ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id');

    return new Promise((resolve) => {
      const respUserGroupsDTOArray: UserGroupInfoDTO[] = [];
      appDbConnection.select(sql)
        .then((result) => {

          if (result.rows.length) {
            result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeColumnResultSet([
                'id',
                'status',
                'account_id',
                'group_id',
                'user_id',
                'join_date',
                'name',
                'category',
                'last_update_usec'
            ],
            rowData) as UserGroupInfoDTO;
              respUserGroupsDTOArray.push(data);
            });
            resolve(respUserGroupsDTOArray);
            return;
          } else {
          // not found with the id
          resolve(respUserGroupsDTOArray);
          }

        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(respUserGroupsDTOArray);
          return;
        });
      });
  };

  findByGroupId = (
    groupId: string,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[]
  ): Promise<UserGroupInfoDTO[]> => {
    const respUserGroupsDTOArray: UserGroupInfoDTO[] = [];
    let sql = 'SELECT BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'id') + '), ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ', ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') + '), ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') + '), ';
    sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + '), ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'join_date') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'group_name') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'category') + ', ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'last_update_usec');
    sql += ' FROM ' + this.tableName + ', ' + socialGroups_schema_table;
    sql += ' WHERE ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + SqlStr.format(' = ?', [this.siteCode]) + ' AND ';
    sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') + SqlStr.format(' = UUID_TO_BIN(?)', [groupId]) + ' AND ';
    sql += SqlFormatter.fmtTableFieldStr(socialGroups_schema_table, 'id') + ' = ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id');

    return new Promise((resolve) => {
      appDbConnection.select(sql)
        .then((result) => {

          if (result.rows.length) {
            result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeColumnResultSet([
                'id',
                'status',
                'account_id',
                'group_id',
                'user_id',
                'join_date',
                'name',
                'category',
                'last_update_usec'
            ],
            rowData) as UserGroupInfoDTO;
              respUserGroupsDTOArray.push(data);
            });
            resolve(respUserGroupsDTOArray);
            return;
          } else {
          // not found with the id
          resolve(respUserGroupsDTOArray);
          }

        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(respUserGroupsDTOArray);
          return;
        });
      });
  };
}

export default UserGroupModel;

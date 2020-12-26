import { users_schema_table } from './../../schemas/users.schema';
import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { friends_schema, friends_schema_table } from '../../schemas/friends.schema';
import { FriendDTO } from '../../dtos/friends.DTO';
import { EntityModel } from './entity.model';
import dbConnection from '../../modules/DbModule';
import SysLog from '../../modules/SysLog';
import SqlStr = require('sqlstring');
import { FriendListDTO } from '../../dtos/friendList.DTO';

export class FriendModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = friends_schema_table;
    }
    this.requestDTO = FriendDTO;
    this.responseDTO = FriendDTO;
    this.schema = friends_schema;
  }

  findByUserId = (userId: string): Promise<any | undefined> => {
    return new Promise ((resolve) => {
      let sql =
      SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        const resFriendDTOArray: FriendDTO[] = [];
        if (result.rows.length) {

            result.rows.forEach ((rowData) => {
                const data = SqlFormatter.transposeResultSet(this.schema,
                undefined,
                undefined,
                rowData);
                const respFriendDTO = new this.responseDTO(data) as FriendDTO;
                resFriendDTOArray.push(respFriendDTO.data);
            });
          resolve(resFriendDTOArray);
          return;
        }
        // not found Customer with the id
        resolve(resFriendDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      })

    });
  };

  getFriendList = (userId: string): Promise<any | undefined> => {
    return new Promise ((resolve) => {
      let sql = '';
      sql = 'SELECT BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'id') + '), ';
      sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + '), ';
      sql += 'BIN_TO_UUID('+SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_id') + '), ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'user_name') + ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'avatar') + ',';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_date');
      sql += ' FROM ' + this.tableName + ', ' + users_schema_table;
      sql += ' WHERE ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + SqlStr.format(' = ?', [this.siteCode]) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ' != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + SqlStr.format(' = UUID_TO_BIN(?)', [userId]) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'id') + ' = ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_id');
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        const resFriendListDTOArray: FriendListDTO[] = [];
        if (result.rows.length) {

            result.rows.forEach ((rowData) => {
                const data = SqlFormatter.transposeColumnResultSet([
                    'id',
                    'user_id',
                    'friend_id',
                    'name',
                    'avatar',
                    'since'
                ],
                rowData);
                resFriendListDTOArray.push(data);
            });
          resolve(resFriendListDTOArray);
          return;
        }
        // not found Customer with the id
        resolve(resFriendListDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      })

    });
  };
}

import { ActivityModel } from './activity.model';
import { users_schema_table } from './../../schemas/users.schema';
import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  friends_schema,
  friends_schema_table
} from '../../schemas/friends.schema';
import {
  FriendDTO,
  FriendListDTO,
  ContactListDTO,
  ContactListData
} from '../../dtos/friends.DTO';
import { EntityModel } from './entity.model';
import appDbConnection from '../../modules/AppDBModule';
import SysLog from '../../modules/SysLog';
import SqlStr = require('sqlstring');

export class FriendModel extends EntityModel {
  activities = new ActivityModel();
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = friends_schema_table;
    }
    this.requestDTO = FriendDTO;
    this.responseDTO = FriendDTO;
    this.schema = friends_schema;
  }

  /**
   * Create a friends record with friend_status = REQUEST
   * and an activity for friend request for target user
   * @param dataInEntity - friends DTO data
   * @returns 
   */
  createFriend(dataInEntity: any): Promise<any> 
  {
    return new Promise((resolve) => {
      this.create(dataInEntity).then((newFriend) => {
        if (newFriend.friend_status === 'REQUEST') {
          this.activities.addFriendRequest(newFriend).finally(() => {
            resolve(newFriend);
          })
        } else {
          resolve(newFriend);
        }
      })
      .catch(() => {
        resolve(undefined);
      })
    })
  }

  /**
   * Find the friends list for user
   * @param userId - user
   * @returns 
   */
  findByUserId = (userId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      const resFriendDTOArray: FriendDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]);
      SysLog.info('findById SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respFriendDTO = new this.responseDTO(data) as FriendDTO;
              resFriendDTOArray.push(respFriendDTO);
            });
            resolve(resFriendDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resFriendDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resFriendDTOArray);
          return;
        });
      });

    });
  };

  /**
   * Get the friend list for user - friend_status = OK
   * @param userId - user
   * @returns 
   */
  getFriendList = (userId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      const resFriendListDTOArray: FriendListDTO[] = [];
      let sql = '';
      sql = 'SELECT BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'id') +'), ';
      sql += 'BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') + '), ';
      sql += 'BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_id') + '), ';
      sql += 'CONCAT(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'first_name') + ',' + SqlStr.escape(' ');
      sql += ',' + SqlFormatter.fmtTableFieldStr(this.tableName, 'last_name') + '), ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'avatar') + ',';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_date');
      sql += ' FROM ' + this.tableName;
      sql += ' LEFT OUTER JOIN ' + users_schema_table + ' ON ';
      sql +=
        SqlFormatter.fmtTableFieldStr(users_schema_table, 'id') +
        ' = ' +
        SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_id');
      sql += ' WHERE ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') +
        SqlStr.format(' = ?', [this.siteCode]) +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'status') +
        ' != ' +
        SqlStr.escape('DELETED') +
        ' AND ';
        sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_status') +
        ' = ' +
        SqlStr.escape('OK') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(userId) +
        ') ';
      SysLog.info('findById SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeColumnResultSet(
                ['id', 'user_id', 'friend_id', 'name', 'avatar', 'since'],
                rowData
              );
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
          resolve(resFriendListDTOArray);
          return;
        });
      });

    });
  };

  /**
   * Get Contact List for user
   * @param userId - user
   * @returns 
   */
  getContactList = (userId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      const resContactListDTOArray: ContactListDTO[] = [];
      let sql = 'SELECT ';
      sql += SqlFormatter.formatTableSelect(this.tableName, this.schema);
      sql += ' FROM ' + this.tableName;
      sql += ' WHERE ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') +
        SqlStr.format(' = ?', [this.siteCode]) +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'status') +
        ' != ' +
        SqlStr.escape('DELETED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(userId) +
        ') ';
      SysLog.info('findById SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = new ContactListDTO() as ContactListData;
              let idx = 0;
              idx = SqlFormatter.transposeTableSelectColumns(
                idx,
                data,
                this.schema,
                rowData
              );

              resContactListDTOArray.push(data);
            });
            resolve(resContactListDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resContactListDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resContactListDTOArray);
          return;
        });
      });

    });
  };

/**
 * Toggle the starred in the friends record
 * @param id - friends.id
 * @returns 
 */
  toggleContactStar = (id: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      this.findById(id)
        .then((friendDTO) => {
          let sql = '';
          sql = 'UPDATE ' + this.tableName;
          sql += ' SET ' + 'starred' + ' = ';
          sql += !friendDTO.starred + ' ';
          sql += SqlFormatter.formatWhereAND(
            '',
            { id: id },
            this.tableName,
            this.schema
          );
          appDbConnection.connectDB().then((DBSession) => {
          DBSession.sql(sql)
            .execute()
            .then((result) => {
              SysLog.info('updated friends starred: ', { id: id });
              this.findById(id).then((respFriendDTO) => {
                resolve(respFriendDTO);
              });
            })
            .catch((err) => {
              SysLog.error(JSON.stringify(err));
              resolve(undefined);
              return;
            });
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
 * Increment the frequency of contact
 * @param friendId  point to user(friend_id)
 * @returns 
 */
  incrementFrequencyById = (friendId: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = '';
      sql = 'UPDATE ' + SqlStr.escape(this.tableName);
      sql =
        ' SET ' +
        SqlStr.escape('frequent') +
        ' = ' +
        SqlStr.escape('frequent') +
        ' + 1 ';
      sql += SqlFormatter.formatWhereAND(
        '',
        { id: friendId },
        this.tableName,
        this.schema
      );
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          SysLog.info('updated friend frequency: ', { id: friendId });
          this.findById(friendId).then((respFriendDTO) => {
            resolve(respFriendDTO);
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

/**
 * Check if user(friend_id) is already a friend to user(user_id)
 * @param req - request body { user_id, friend_id}
 * @returns 
 */
  areFriends(req: any): Promise<any> {
    return new Promise((resolve) => {
      let sql = '';
      const resp = {
        user_id: req.user_id,
        friend_id: req.friend_id,
        friends: false,
        blocked: false
      };
      sql += 'SELECT BIN_TO_UUID(id)';
      sql += ' FROM ' + this.tableName;
      sql += ' WHERE ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') +
        SqlStr.format(' = ?', [this.siteCode]) +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'status') +
        ' != ' +
        SqlStr.escape('DELETED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_status') +
        ' = ' +
        SqlStr.escape('OK') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.user_id) +
        ') ' + ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.friend_id) +
        ') '
      SysLog.info('findById SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            resp.friends = true;
            resolve(resp);
            return;
          }
          // not found Customer with the id
          resolve(resp);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resp);
          return;
        });
      });

    })
  }


/**
 * Check if user is blocked by friend
 * @param req - request body { user_id, friend_id}
 * @returns 
 */
   isBlockedByFriend(req: any): Promise<any> {
    return new Promise((resolve) => {
      let sql = '';
      const resp = {
        user_id: req.user_id,
        friend_id: req.friend_id,
        blocked: false
      };
      sql += 'SELECT friend_status ';
      sql += ' FROM ' + this.tableName;
      sql += ' WHERE ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') +
        SqlStr.format(' = ?', [this.siteCode]) +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'status') +
        ' != ' +
        SqlStr.escape('DELETED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_status') +
        ' = ' +
        SqlStr.escape('BLOCKED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.friend_id) +
        ') ' + ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.user_id) +
        ') '
      SysLog.info('findById SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            resp.blocked = true;
            resolve(resp);
            return;
          }
          // not found Customer with the id
          resolve(resp);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resp);
          return;
        });
      });

    })
  }

/**
 * Check if account is blocked by user
 * @param req - request body { user_id, friend_id}
 * @returns 
 */
   isAccountBlockedByUser(req: any): Promise<any> {
    return new Promise((resolve) => {
      let sql = '';
      const resp = {
        user_id: req.user_id,
        account_id: req.account_id,
        blocked: false
      };
      sql += 'SELECT friend_status ';
      sql += ' FROM ' + this.tableName;
      sql += ' WHERE ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') +
        SqlStr.format(' = ?', [this.siteCode]) +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'status') +
        ' != ' +
        SqlStr.escape('DELETED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_status') +
        ' = ' +
        SqlStr.escape('BLOCKED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.user_id) +
        ') ' + ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.account_id) +
        ') '
      SysLog.info('findById SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            resp.blocked = true;
            resolve(resp);
            return;
          }
          // not found Customer with the id
          resolve(resp);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resp);
          return;
        });
      });

    })
  }

  /**
 * Check if account is blocked by user
 * @param req - request body { user_id, friend_id}
 * @returns 
 */
   isGroupBlockedByUser(req: any): Promise<any> {
    return new Promise((resolve) => {
      let sql = '';
      const resp = {
        user_id: req.user_id,
        group_id: req.group_id,
        blocked: false
      };
      sql += 'SELECT friend_status ';
      sql += ' FROM ' + this.tableName;
      sql += ' WHERE ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') +
        SqlStr.format(' = ?', [this.siteCode]) +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'status') +
        ' != ' +
        SqlStr.escape('DELETED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'friend_status') +
        ' = ' +
        SqlStr.escape('BLOCKED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.user_id) +
        ') ' + ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.group_id) +
        ') '
      SysLog.info('findById SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            resp.blocked = true;
            resolve(resp);
            return;
          }
          // not found Customer with the id
          resolve(resp);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resp);
          return;
        });
      });

    })
  }

}

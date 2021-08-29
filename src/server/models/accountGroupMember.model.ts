import { users_schema_table } from './../../schemas/users.schema';
import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  accountGroupMembers_schema,
  accountGroupMembers_schema_table
} from '../../schemas/accountGroupMembers.schema';
import {
  AccountGroupMemberDTO,
  AccountGroupMemberListDTO,
  ContactListDTO,
  ContactListData
} from '../../dtos/accountGroupMembers.DTO';
import { EntityModel } from './entity.model';
import dbConnection from '../../modules/DbModule';
import SysLog from '../../modules/SysLog';
import SqlStr = require('sqlstring');
import { AccountGroupActivityModel } from './accountGroupActivity.model';

export class AccountGroupMemberModel extends EntityModel {
  activities = new AccountGroupActivityModel();
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = accountGroupMembers_schema_table;
    }
    this.requestDTO = AccountGroupMemberDTO;
    this.responseDTO = AccountGroupMemberDTO;
    this.schema = accountGroupMembers_schema;
  }

  /**
   * Create a accountGroupMembers record with accountGroupMember_status = REQUEST
   * and an activity for accountGroupMember request for target user
   * @param dataInEntity - accountGroupMembers DTO data
   * @returns
   */
  createAccountGroupMember(dataInEntity: any): Promise<any> {
    return new Promise((resolve) => {
      this.create(dataInEntity)
        .then((newAccountGroupMember) => {
          if (newAccountGroupMember.member_status === 'REQUEST') {
            this.activities
              .addAccountMemberRequest(newAccountGroupMember)
              .finally(() => {
                resolve(newAccountGroupMember);
              });
          } else {
            resolve(newAccountGroupMember);
          }
        })
        .catch(() => {
          resolve(undefined);
        });
    });
  }

  /**
   * Find the accountGroupMembers list for account
   * @param accountId - account
   * @returns
   */
  findByUserId = (accountId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      const resAccountGroupMemberDTOArray: AccountGroupMemberDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += 'group_id = 0 AND ';
      sql += SqlStr.format('account_id = UUID_TO_BIN(?)', [accountId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
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
              const respAccountGroupMemberDTO = new this.responseDTO(
                data
              ) as AccountGroupMemberDTO;
              resAccountGroupMemberDTOArray.push(respAccountGroupMemberDTO);
            });
            resolve(resAccountGroupMemberDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resAccountGroupMemberDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resAccountGroupMemberDTOArray);
          return;
        });
    });
  };

  /**
   * Get the accountGroupMember list for account - accountGroupMember_status = OK
   * @param accountId - account
   * @returns
   */
  getAccountGroupMemberList = (accountId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      const resAccountGroupMemberListDTOArray: AccountGroupMemberListDTO[] = [];
      let sql = '';
      sql =
        'SELECT BIN_TO_UUID(' +
        SqlFormatter.fmtTableFieldStr(this.tableName, 'id') +
        '), ';
      sql +=
        'BIN_TO_UUID(' +
        SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') +
        '), ';
      sql +=
        'BIN_TO_UUID(' +
        SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') +
        '), ';
      sql +=
        'BIN_TO_UUID(' +
        SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') +
        '), ';
      sql +=
        'CONCAT(' +
        SqlFormatter.fmtTableFieldStr(this.tableName, 'first_name') +
        ',' +
        SqlStr.escape(' ');
      sql +=
        ',' +
        SqlFormatter.fmtTableFieldStr(this.tableName, 'last_name') +
        '), ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'avatar') + ',';
      sql += SqlFormatter.fmtTableFieldStr(
        this.tableName,
        'member_date'
      );
      sql += ' FROM ' + this.tableName;
      sql += ' LEFT OUTER JOIN ' + users_schema_table + ' ON ';
      sql +=
        SqlFormatter.fmtTableFieldStr(users_schema_table, 'id') +
        ' = ' +
        SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id');
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
      sql += 'group_id = 0 AND '
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(accountId) +
        ') ';
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeColumnResultSet(
                [
                  'id',
                  'account_id',
                  'group_id',
                  'user_id',
                  'name',
                  'avatar',
                  'since'
                ],
                rowData
              );
              resAccountGroupMemberListDTOArray.push(data);
            });
            resolve(resAccountGroupMemberListDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resAccountGroupMemberListDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resAccountGroupMemberListDTOArray);
          return;
        });
    });
  };

  /**
   * Get Contact List for account
   * @param accountId - account
   * @returns
   */
  getContactList = (accountId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      const resContactListDTOArray: ContactListDTO[] = [];
      let sql = 'SELECT ';
      sql += SqlFormatter.formatTableSelect(this.tableName, this.schema) + ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'avatar');
      sql += ' FROM ' + this.tableName;
      sql += ' LEFT OUTER JOIN ' + users_schema_table + ' ON ';
      sql +=
        SqlFormatter.fmtTableFieldStr(users_schema_table, 'id') +
        ' = ' +
        SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id');
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
      sql += 'group_id = 0 AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(accountId) +
        ') ';
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
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
              idx = SqlFormatter.transposeTableSelectColumnArray(
                idx,
                data.user,
                ['avatar'],
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
  };

  /**
   * Toggle the starred in the accountGroupMembers record
   * @param id - accountGroupMembers.id
   * @returns
   */
  toggleContactStar = (id: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      this.findById(id)
        .then((accountGroupMemberDTO) => {
          let sql = '';
          sql = 'UPDATE ' + this.tableName;
          sql += ' SET ' + 'starred' + ' = ';
          sql += !accountGroupMemberDTO.starred + ' ';
          sql += SqlFormatter.formatWhereAND(
            '',
            { id: id },
            this.tableName,
            this.schema
          );
          dbConnection.DB.sql(sql)
            .execute()
            .then((result) => {
              SysLog.info('updated accountGroupMembers starred: ', { id: id });
              this.findById(id).then((respAccountGroupMemberDTO) => {
                resolve(respAccountGroupMemberDTO);
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
  };

  /**
   * Increment the frequency of contact
   * @param accountGroupMemberId  point to accountGroupMembers record
   * @returns
   */
  incrementFrequencyById = (
    accountGroupMemberId: string
  ): Promise<any | undefined> => {
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
        { id: accountGroupMemberId },
        this.tableName,
        this.schema
      );
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          SysLog.info('updated accountGroupMember frequency: ', {
            id: accountGroupMemberId
          });
          this.findById(accountGroupMemberId).then(
            (respAccountGroupMemberDTO) => {
              resolve(respAccountGroupMemberDTO);
            }
          );
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };

  /**
   * Check if account(user_id) is already a accountGroupMember to account(user_id)
   * @param req - request body { account_id, user_id}
   * @returns
   */
  areAccountMembers(req: any): Promise<any> {
    return new Promise((resolve) => {
      let sql = '';
      const resp = {
        account_id: req.account_id,
        user_id: req.user_id,
        accountGroupMembers: false,
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
        SqlFormatter.fmtTableFieldStr(
          this.tableName,
          'member_status'
        ) +
        ' = ' +
        SqlStr.escape('OK') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.account_id) +
        ') ' +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(this.tableName, 'user_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.user_id) +
        ') ';
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            resp.accountGroupMembers = true;
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
  }

  /**
   * Check if user is blocked by accountGroupMember
   * @param req - request body { account_id, user_id}
   * @returns
   */
  isBlockedByAccount(req: any): Promise<any> {
    return new Promise((resolve) => {
      let sql = '';
      const resp = {
        account_id: req.account_id,
        user_id: req.user_id,
        blocked: false
      };
      sql += 'SELECT member_status ';
      sql += ' FROM ' + accountGroupMembers_schema_table;
      sql += ' WHERE ';
      sql +=
        SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'site_code') +
        SqlStr.format(' = ?', [this.siteCode]) +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'status') +
        ' != ' +
        SqlStr.escape('DELETED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(
          accountGroupMembers_schema_table,
          'status'
        ) +
        ' = ' +
        SqlStr.escape('BLOCKED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'account_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.account_id) +
        ') ' +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'user_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.user_id) +
        ') ';
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
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
  }

  /**
   * Check if user is blocked by accountGroupMember
   * @param req - request body { account_id, user_id}
   * @returns
   */
  isBlockedByGroup(req: any): Promise<any> {
      return new Promise((resolve) => {
        let sql = '';
        const resp = {
          group_id: req.group_id,
          user_id: req.user_id,
          blocked: false
        };
        sql += 'SELECT member_status ';
        sql += ' FROM ' + accountGroupMembers_schema_table;
        sql += ' WHERE ';
        sql +=
          SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'site_code') +
          SqlStr.format(' = ?', [this.siteCode]) +
          ' AND ';
        sql +=
          SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'status') +
          ' != ' +
          SqlStr.escape('DELETED') +
          ' AND ';
        sql +=
          SqlFormatter.fmtTableFieldStr(
            accountGroupMembers_schema_table,
            'status'
          ) +
          ' = ' +
          SqlStr.escape('BLOCKED') +
          ' AND ';
        sql +=
          SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'group_id') +
          ' = UUID_TO_BIN(' +
          SqlStr.escape(req.group_id) +
          ') ' +
          ' AND ';
        sql +=
          SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'user_id') +
          ' = UUID_TO_BIN(' +
          SqlStr.escape(req.user_id) +
          ') ';
        SysLog.info('findById SQL: ' + sql);
        dbConnection.DB.sql(sql)
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
    }

      /**
   * Check if user is blocked by accountGroupMember
   * @param req - request body { account_id, user_id}
   * @returns
   */
  getAccountMemberData(req: any): Promise<any> {
    return new Promise((resolve) => {
      const resp = new AccountGroupMemberDTO();

      let sql = 'SELECT ';
      sql += SqlFormatter.formatTableSelect(this.tableName, this.schema) + ', ';
      sql += ' FROM ' + accountGroupMembers_schema_table;
      sql += ' WHERE ';
      sql +=
        SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'site_code') +
        SqlStr.format(' = ?', [this.siteCode]) +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'status') +
        ' != ' +
        SqlStr.escape('DELETED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(
          accountGroupMembers_schema_table,
          'status'
        ) +
        ' = ' +
        SqlStr.escape('BLOCKED') +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'account_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.account_id) +
        ') ' +
        ' AND ';
      sql +=
        SqlFormatter.fmtTableFieldStr(accountGroupMembers_schema_table, 'user_id') +
        ' = UUID_TO_BIN(' +
        SqlStr.escape(req.user_id) +
        ') ';
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            let idx = 0;
            idx = SqlFormatter.transposeTableSelectColumns(
              idx,
              resp,
              this.schema,
              result.rows[0]
            );
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
  }
}

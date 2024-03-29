/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import appDbConnection from '../../modules/AppDBModule';
import { ResponseUserDTO, CreateUserDTO } from '../../dtos/user.DTO';
import { UserData, users_schema, users_schema_table } from '../../schemas/users.schema';
import SysLog from '../../modules/SysLog';
import { bcryptHash, cryptoStr } from '../../modules/cryto';
import { EntityModel } from './entity.model';
import Session from 'mysqlx/lib/Session';

export class UserModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = users_schema_table;
    }
    this.requestDTO = CreateUserDTO;
    this.responseDTO = ResponseUserDTO;
    this.schema = users_schema;
  }

  findByEmail = (email: string, session?: Session): Promise<ResponseUserDTO | UserData | undefined> => {
    return new Promise((resolve) => {
      let sql =
        SqlFormatter.formatSelect(this.tableName, users_schema) + ' WHERE ';
      sql += SqlStr.format('email = ?', [email]) + ' AND ';
      sql = SqlFormatter.formatWhereAND(sql, {site_code: this.siteCode}, this.tableName, users_schema);
      appDbConnection.select(sql, session)
        .then((result) => {
          if (result.rows.length) {
            const data = SqlFormatter.transposeResultSet(
              users_schema,
              undefined,
              undefined,
              result.rows[0]
            );
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

  updateRegConfirmKeyByEmail = async (
    emailStr: string,
    regConfirmKey: string
  ): Promise<ResponseUserDTO | UserData | undefined> => {
    return new Promise((resolve) => {
      let sql = '';
      sql += 'UPDATE ' + users_schema_table;
      sql += ' SET users.reg_confirm_key = ' + SqlStr.escape(regConfirmKey);
      sql += SqlFormatter.formatWhereAND(
        '',
        { email: emailStr },
        this.tableName,
        users_schema
      ) + ' AND ';
      sql = SqlFormatter.formatWhereAND(sql, {site_code: this.siteCode}, this.tableName, users_schema);
      appDbConnection.getNewDbSession().then((DBSession) => {
      appDbConnection.update(sql, DBSession)
        .then((result) => {
          SysLog.info('updated user: ', { email: emailStr, regConfirmKey });
          this.findByEmail(emailStr, DBSession).then((respUserDTO) => {
            DBSession.getXSession().close();
            resolve(respUserDTO);
          });
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          DBSession.getXSession().close();
          resolve(undefined);
          return;
        });
      }).catch(() => resolve(undefined));

    });
  };

  updateResetPasswordKeyByEmail = async (
    emailStr: string,
    pwdResetKey: string
  ): Promise<ResponseUserDTO | UserData | undefined> => {
    return new Promise((resolve) => {
      let sql = '';
      sql += 'UPDATE ' + users_schema_table;
      sql += ' SET users.pwd_reset_key = ' + SqlStr.escape(pwdResetKey);
      sql += SqlFormatter.formatWhereAND(
        '',
        { email: emailStr },
        this.tableName,
        users_schema
      ) + ' AND ';
      sql = SqlFormatter.formatWhereAND(sql, {site_code: this.siteCode}, this.tableName, users_schema);
      appDbConnection.getNewDbSession().then((DBSession) => {
      appDbConnection.update(sql, DBSession)
        .then((result) => {
          SysLog.info('updated user: ', { email: emailStr, pwdResetKey });
          this.findByEmail(emailStr, DBSession).then((respUserDTO) => {
            DBSession.getXSession().close();
            resolve(respUserDTO);
          });
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          DBSession.getXSession().close();
          resolve(undefined);
          return;
        });
      }).catch(() => resolve(undefined));

    });
  };

  updatePasswordNResetKeyByEmail = async (
    emailStr: string,
    newPassword: string
  ): Promise<ResponseUserDTO | UserData | undefined> => {
    return new Promise((resolve) => {
      const doUpdatePassword = (encryptedPwd: string) => {
        let sql = '';
        sql += 'UPDATE ' + users_schema_table;
        sql += ' SET users.pwd_reset_key = '+SqlStr.escape('');
        sql += ' , users.password = '+SqlStr.escape(encryptedPwd);
        sql += SqlFormatter.formatWhereAND(
          '',
          { email: emailStr },
          this.tableName,
          users_schema
        ) + ' AND ';
        sql = SqlFormatter.formatWhereAND(sql, {site_code: this.siteCode}, this.tableName, users_schema);
        appDbConnection.getNewDbSession().then((DBSession) => {
        appDbConnection.update(sql, DBSession)
          .then((result) => {
            SysLog.info('updated user password:  ', { email: emailStr });
            this.findByEmail(emailStr, DBSession).then((respUserDTO) => {
              DBSession.getXSession().close();
              resolve(respUserDTO);
            });
          })
          .catch((err) => {
            SysLog.error(JSON.stringify(err));
            DBSession.getXSession().close();
            resolve(undefined);
            return;
          });
        }).catch(() => resolve(undefined));

      }

      let passwdProp: any;
      users_schema.some((prop) => {
        if (prop.fieldName === 'password') {
          passwdProp = prop;
          return true;
        }
      });
      if (passwdProp !== undefined) {
        if (passwdProp.bcryptIt !== undefined && passwdProp.bcryptIt) {
          bcryptHash(newPassword).then((secret) => {
            doUpdatePassword(secret);
          });
        } else {
          cryptoStr(newPassword).then((secret) => {
            doUpdatePassword(secret);
          });
        }
      }
    });
  };

  searchUserByKeyword(keyword: string): Promise<any[]> {

    return new Promise ((resolve) => {
      const resUserListDTOArray: any[] = [];
      let sql = '';
      sql = 'SELECT BIN_TO_UUID(' + SqlFormatter.fmtTableFieldStr(this.tableName, 'id') + '), ';
      sql += 'CONCAT(' + SqlFormatter.fmtTableFieldStr(users_schema_table, 'first_name') + ',' + SqlStr.escape(' ');
      sql += ',' + SqlFormatter.fmtTableFieldStr(users_schema_table, 'last_name') + '), ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'first_name') + ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'avatar') + ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'email') + ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'allow_notification')+ ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'allow_msg')+ ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'allow_friends')+ ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'allow_promo')+ ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'allow_follows')+ ', ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'public');
      sql += ' FROM ' + users_schema_table;
      sql += ' WHERE ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + SqlStr.format(' = ?', [this.siteCode]) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ' != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(users_schema_table, 'allow_friends') + ' = true AND ';
      sql += '(' + SqlFormatter.fmtLIKECondition(SqlFormatter.fmtTableFieldStr(users_schema_table, 'first_name'), keyword)  + '  OR  ';
      sql += SqlFormatter.fmtLIKECondition(SqlFormatter.fmtTableFieldStr(users_schema_table, 'last_name'), keyword)  + '  OR  '
      sql += SqlFormatter.fmtLIKECondition(SqlFormatter.fmtTableFieldStr(users_schema_table, 'username'), keyword)  + '  OR  '
      sql += SqlFormatter.fmtLIKECondition(SqlFormatter.fmtTableFieldStr(users_schema_table, 'email'), keyword)  + ') ';
      sql += ' LIMIT 10;'
      appDbConnection.select(sql)
      .then((result) => {

        if (result.rows.length) {

            result.rows.forEach ((rowData) => {
                const data = SqlFormatter.transposeColumnResultSet([
                    'id',
                    'full_name',
                    'first_name',
                    'avatar',
                    'email',
                    'allow_notification',
                    'allow_msg',
                    'allow_friends',
                    'allow_promo',
                    'allow_follows',
                    'public'
                ],
                rowData);
                resUserListDTOArray.push(data);
            });
          resolve(resUserListDTOArray);
          return;
        } else {
        resolve(resUserListDTOArray);
        }

      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(resUserListDTOArray);
        return;
      })
      });

  }
}

export default UserModel;

import { TokenData } from './../../schemas/tokens.schema';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import appDbConnection from '../../modules/AppDBModule';
import { token_schema, tokens_schema_table } from '../../schemas/tokens.schema';
import { TokenDTO } from '../../dtos/tokens.DTO';
import { uuidIfc } from '../../interfaces/uuidIfc';
import DataStoredInToken from '../../interfaces/DataStoredInToken';
import CommonFn, { DateAddIntervalEnum } from '../../modules/CommonFnModule';
import SysLog from '../../modules/SysLog';
import { EntityModel } from './entity.model';
import Session from 'mysqlx/lib/Session';

export class TokenModel extends EntityModel{


  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = tokens_schema_table;
    }
    this.requestDTO = TokenDTO;
    this.responseDTO = TokenDTO;
    this.schema = token_schema;
  }


  createToken = (
    dataInToken: DataStoredInToken,
    jwtSignToken: string
  ): Promise<TokenDTO | TokenData | undefined> => {
    return new Promise((resolve) => {
      const newToken = new TokenDTO(dataInToken) as TokenData;
      newToken.site_code = this.siteCode;
      const len = jwtSignToken.length;
      newToken.token = jwtSignToken;
      SqlFormatter.formatInsert(
        [{ fieldName: 'site_code', value: this.siteCode },
         { fieldName: 'token', value: jwtSignToken }],
        newToken,
        this.tableName,
        token_schema
      ).then((sql) => {
        appDbConnection.insert(sql).then((newId) => {
          newToken.id = newId;
          resolve(newToken);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));

          resolve(undefined);
        });
      });
    });
  };

  removeByUuid = (uuid: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
      let sql = 'DELETE FROM ' + this.tableName + ' WHERE ';
      sql += `site_code = '${this.siteCode}' AND `;
      sql += SqlStr.format('uuid = UUID_TO_BIN(?)', [uuid]);
      sql += ';';
      appDbConnection.getNewDbSession().then((DBSession) => {
      DBSession.sql(sql + ';')
        .execute()
        .then((result) => {
          SysLog.info('deleted ' + this.tableName + ' with uuid: ', uuid);
          DBSession.getXSession().close();
          resolve(uuid);
        })
        .catch((err) => {
          SysLog.error('error: ', err);
          DBSession.getXSession().close();
          resolve(undefined);
          return;
        });
      }).catch(() => resolve(undefined));

    });
  };

  tokenExpired = (expiryInSec: number, createTimeStamp: string) => {
    let tokenExpired = true;
    const now = new Date();
    const sec = expiryInSec;
    const tokenDate = new Date(createTimeStamp);
    const expiry = CommonFn.dateAdd(tokenDate, DateAddIntervalEnum.SECOND, sec);
    // SysLog.info('now: ' + now.toUTCString());
    // SysLog.info('expiry: ' + expiry.toUTCString());
    if (now.valueOf() < expiry.valueOf()) {
      tokenExpired = false;
    }
    return tokenExpired;
  };

  purgeExpired = () => {
      // SysLog.info('purging expired tokens..');
      let sql = SqlFormatter.formatSelect(this.tableName, token_schema);
      sql += SqlFormatter.formatWhereAND('', {site_code: this.siteCode}, this.tableName, token_schema);
      appDbConnection.getNewDbSession().then((DBSession) => {
      appDbConnection.select(sql, DBSession)
        .then((result) => {
          const deleteToken = (idx: number, session: Session) => {
            if(idx >= result.rows.length) {
              DBSession.getXSession().close();
              return;
            }
            const rowData = result.rows[idx];
            const token = SqlFormatter.transposeResultSet(
              token_schema,
              undefined,
              undefined,
              rowData
            );
            this.remove(token.id, session).then(() => {
              SysLog.info('Purged remove token');
              deleteToken(idx + 1, session)
            });
          }

          deleteToken(0, DBSession);
        })
        .catch((err) => {
          DBSession.getXSession().close();
          SysLog.error(JSON.stringify(err));
          return;
        });
      }).catch(() => {return;});
  };
}

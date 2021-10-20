import { TokenData } from './../../schemas/tokens.schema';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection from '../../modules/DbModule';
import { token_schema, tokens_schema_table } from '../../schemas/tokens.schema';
import { TokenDTO } from '../../dtos/tokens.DTO';
import { uuidIfc } from '../../interfaces/uuidIfc';
import DataStoredInToken from '../../interfaces/DataStoredInToken';
import CommonFn, { DateAddIntervalEnum } from '../../modules/CommonFnModule';
import SysLog from '../../modules/SysLog';
import SysEnv from '../../modules/SysEnv';
import { EntityModel } from './entity.model';

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
        newToken,
        this.tableName,
        token_schema
      ).then((sql) => {
        dbConnection.DB.sql('SET @uuidId=UUID(); ')
          .execute()
          .then((result1) => {
            dbConnection.DB.sql(sql)
              .execute()
              .then((result2) => {
                dbConnection.DB.sql('SELECT @uuidId;')
                  .execute()
                  .then((result3) => {
                    SysLog.info('created Token');
                    const newUuid: uuidIfc = { '@uuidId': result3.rows[0][0] }; // TODO
                    newToken.id = newUuid['@uuidId'];
                    resolve(newToken);
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
            const respTokenDTO = new TokenDTO(newToken);
            resolve(respTokenDTO);
            return;
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
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          SysLog.info('deleted ' + this.tableName + ' with uuid: ', uuid);
          resolve(uuid);
        })
        .catch((err) => {
          SysLog.error('error: ', err);
          resolve(undefined);
          return;
        });
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
    if (dbConnection.DB) {
      // SysLog.info('purging expired tokens..');
      let sql = SqlFormatter.formatSelect(this.tableName, token_schema);
      sql += SqlFormatter.formatWhereAND('', {site_code: this.siteCode}, this.tableName, token_schema);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length > 0) {
            result.rows.forEach((rowData: any) => {
              const token = SqlFormatter.transposeResultSet(
                token_schema,
                undefined,
                undefined,
                rowData
              );
              if (this.tokenExpired(token.expiryInSec, token.createTimeStamp)) {
                this.remove(token.id).then(() => {
                  SysLog.info('Purged remove token');
                });
              }
            });
          }
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          return;
        });
    }
  };
}

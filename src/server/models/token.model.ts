/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection from '../../modules/DbModule';
import { token_schema, tokens_schema_table } from '../../schemas/tokens.schema';
import { TokenDTO } from '../../dtos/tokens.DTO';
import { uuidIfc } from './uuidIfc';
import DataStoredInToken from '../../interfaces/DataStoredInToken';
import CommonFn, { DateAddIntervalEnum } from '../../modules/CommonFnModule';
import SysLog from '../../modules/SysLog';
import SysEnv from '../../modules/SysEnv';

export class TokenModel {
  tableName = tokens_schema_table;
  siteCode = SysEnv.SITE_CODE;

  constructor(altTable: string) {
    if (altTable) {
      this.tableName = altTable;
      this.siteCode = SysEnv.SITE_CODE;
    }
  }

  create = (
    dataInToken: DataStoredInToken,
    jwtSignToken: string
  ): Promise<TokenDTO | undefined> => {
    return new Promise((resolve) => {
      const newToken = new TokenDTO(dataInToken);
      newToken.data.site_code = this.siteCode;
      const len = jwtSignToken.length;
      newToken.data.token = jwtSignToken;
      SqlFormatter.formatInsert(
        newToken.data,
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
                    newToken.data.id = newUuid['@uuidId'];
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

  findById = (tokenId: string): Promise<TokenDTO | undefined> => {
    return new Promise((resolve) => {
      let sql =
        SqlFormatter.formatSelect(this.tableName, token_schema) + ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [tokenId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            const data = SqlFormatter.transposeResultSet(
              token_schema,
              undefined,
              undefined,
              result.rows[0]
            );
            const respTokenDTO = new TokenDTO(data);
            resolve(respTokenDTO);
            return;
          }
          // not found token with the id
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
    tokenId: string,
    tokenDTO: any
  ): Promise<TokenDTO | undefined> => {
    return new Promise((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, token_schema, tokenDTO).then(
        (sql) => {
          sql += SqlFormatter.formatWhereAND(
            '',
            { id: tokenId },
            this.tableName,
            token_schema
          );
          dbConnection.DB.sql(sql)
            .execute()
            .then((result) => {
              SysLog.info('updated token: ', { id: tokenId, ...tokenDTO });
              this.findById(tokenId).then((respTokenDTO) => {
                resolve(respTokenDTO);
              });
            })
            .catch((err) => {
              SysLog.error(JSON.stringify(err));
              resolve(undefined);
              return;
            });
        }
      );
    });
  };

  find = (
    conditions: any,
    showPassword?: boolean,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[]
  ): Promise<TokenDTO[] | undefined> => {
    let sql = SqlFormatter.formatSelect(
      this.tableName,
      token_schema,
      ignoreExclSelect,
      excludeSelectProp
    );
    sql += SqlFormatter.formatWhereAND(
      '',
      conditions,
      this.tableName,
      token_schema
    );
    SysLog.info('find SQL: ' + sql);
    return new Promise((resolve) => {
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          const respTokenDTOArray: TokenDTO[] = [];
          if (result.rows.length) {
            result.rows.forEach((rowData: any) => {
              const data = SqlFormatter.transposeResultSet(
                token_schema,
                ignoreExclSelect,
                excludeSelectProp,
                rowData
              );
              const respTokenDTO = new TokenDTO(data);
              respTokenDTOArray.push(respTokenDTO);
            });
            resolve(respTokenDTOArray);
            return;
          }
          // not found with the id return undefined
          resolve(undefined);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };

  getAll = (): Promise<TokenDTO[] | undefined> => {
    return new Promise((resolve) => {
      dbConnection.DB.sql(
        SqlFormatter.formatSelect(this.tableName, token_schema)
      )
        .execute()
        .then((result) => {
          const respTokenDTOArray: TokenDTO[] = [];
          if (result.rows.length) {
            result.rows.forEach((rowData: any) => {
              const data = SqlFormatter.transposeResultSet(
                token_schema,
                undefined,
                undefined,
                rowData
              );
              const respTokenDTO = new TokenDTO(data);
              respTokenDTOArray.push(respTokenDTO);
            });
            resolve(respTokenDTOArray);
            return;
          }
          // not found
          resolve(respTokenDTOArray);
        })
        .catch((err) => {
          SysLog.error('error: ', err);
          resolve(undefined);
          return;
        });
    });
  };

  remove = (id: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
      let sql = 'DELETE FROM ' + this.tableName + ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [id]);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length == 0) {
            // not found token with the id
            resolve(undefined);
            return;
          }
          SysLog.info('deleted ' + this.tableName + ' with id: ', id);
          resolve(id);
        })
        .catch((err) => {
          SysLog.error('error: ', err);
          resolve(undefined);
          return;
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
          if (result.rows.length == 0) {
            // not found token with the uuid
            resolve(undefined);
            return;
          }
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
      dbConnection.DB.sql(
        SqlFormatter.formatSelect(this.tableName, token_schema)
      )
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

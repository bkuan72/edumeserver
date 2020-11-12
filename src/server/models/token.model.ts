/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection from '../../modules/DbModule';
import { token_schema } from '../../schemas/tokens.schema';
import { TokenDTO } from '../../dtos/tokens.DTO';
import { uuidIfc } from './uuidIfc';
import DataStoredInToken from '../../interfaces/DataStoredInToken';
import CommonFn from '../../modules/CommonFnModule';
import SysLog from '../../modules/SysLog';

export class TokenModel {
  tableName = 'tokens';
  constructor (altTable?: string) {
    if (altTable) {
        this.tableName = altTable;
    }
  }

  create = (dataInToken: DataStoredInToken, jwtSignToken: string): Promise<TokenDTO> => {
    return new Promise((resolve) => {
      const newToken = new TokenDTO(dataInToken);
      const len = jwtSignToken.length;
      newToken.data.token = jwtSignToken;
      SqlFormatter.formatInsert(
        newToken.data,
        this.tableName,
        token_schema
      ).then((sql) => {
        dbConnection.DB.query('SET @uuidId=UUID(); ', (err: any, res: any) => {
          if (err) {
            SysLog.error(JSON.stringify(err));
            const respTokenDTO = new TokenDTO(newToken);
            resolve(respTokenDTO);
            return;
          }
          dbConnection.DB.query(sql, (err: any, res: any) => {
            if (err) {
              SysLog.error(JSON.stringify(err));
            }
            dbConnection.DB.query(
              'SELECT @uuidId;',
              (err: any, res: uuidIfc[]) => {
                if (err) {
                  SysLog.error(JSON.stringify(err));
                  resolve(undefined);
                  return;
                }
                SysLog.info('created Token');
                const newUuid: uuidIfc = res[0];
                newToken.data.id = newUuid['@uuidId'];
                resolve(newToken);
              }
            );
          });
        });
      });
    });
  };

  findById = (tokenId: string): Promise<TokenDTO | undefined> => {
    return new Promise ((resolve) => {
      let sql =
      SqlFormatter.formatSelect(this.tableName, token_schema) + ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [tokenId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.query(sql, (err, res) => {
        if (err) {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        }
        if (res.length) {
          const respTokenDTO = new TokenDTO(res[0]);
          resolve(respTokenDTO);
          return;
        }
        // not found Customer with the id
        resolve(undefined);
      });

    });
  };

  updateById = async (tokenId: string, tokenDTO: any): Promise<TokenDTO | undefined> => {
    return new Promise ((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, token_schema, tokenDTO).then ((sql) => {
        sql += SqlFormatter.formatWhereAND('', {id: tokenId}, token_schema);
        dbConnection.DB.query( sql,
          (err, res) => {
            if (err) {
              SysLog.error(JSON.stringify(err));
              resolve(undefined);
              return;
            }
            if (res.affectedRows == 0) {
              // not found token with the id
              resolve(undefined);
              return;
            }
            SysLog.info('updated token: ', { id: tokenId, ...tokenDTO });
            this.findById(tokenId).then((respTokenDTO) => {
              resolve(respTokenDTO);
            })
          }
        );
      });
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
    sql += SqlFormatter.formatWhereAND('', conditions, token_schema);
    SysLog.info('find SQL: ' + sql);
    return new Promise((resolve) => {
      dbConnection.DB.query(sql, (err, res) => {
        if (err) {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        }
        if (res.length) {
          const respTokenDTOArray: TokenDTO[] = [];
          res.forEach((data: any) => {
            const respTokenDTO = new TokenDTO(data);
            respTokenDTOArray.push(respTokenDTO);
          });
          resolve(respTokenDTOArray);
          return;
        }
        // not found with the id
        resolve(undefined);
      });
    });
  };


  getAll = (): Promise<TokenDTO[] | undefined> => {
    return new Promise ((resolve) => {
      dbConnection.DB.query(
        SqlFormatter.formatSelect(this.tableName, token_schema),
        (err, res) => {
          if (err) {
            SysLog.error('error: ', err);
            resolve(undefined);
            return;
          }
          if (res.length) {
            const respTokenDTOArray:TokenDTO[] = [];
            res.forEach((data: any) => {
              const respTokenDTO = new TokenDTO(data);
              respTokenDTOArray.push(respTokenDTO);
            });
            resolve (respTokenDTOArray);
            return;
          }
          // not found
          resolve(undefined);
        }
      );
    });
  };

  remove = (id: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
      dbConnection.DB.query(
        'DELETE FROM ' + this.tableName + ' WHERE id = UUID_TO_BIN(?);',
        id,
        (err, res) => {
          if (err) {
            SysLog.error('error: ', err);
            resolve(undefined);
            return;
          }
          if (res.affectedRows == 0) {
            // not found Customer with the id
            resolve(undefined);
            return;
          }
          SysLog.info('deleted ' + this.tableName + ' with id: ', id);
          resolve(id);
        }
      );
    });
  };

  purgeExpired = () => {
    SysLog.info('purging expired tokens..');
    dbConnection.DB.query(SqlFormatter.formatSelect(this.tableName, token_schema), (err, res) => {
      if (err) {
        SysLog.error(JSON.stringify(err));
        return;
      }
      const now = new Date();
      if (res.length > 0) {
        res.forEach((token: any) => {
          const min = token.expireInMin/ 60;
          const tokenDate = new Date(token.createTimeStamp);
          const expiry = CommonFn.addMinutesToDate(min, tokenDate);
          SysLog.info('now: ', now.toUTCString());
          SysLog.info('expiry: ', expiry.toUTCString());
          if (now.valueOf() > expiry.valueOf()) {
            this.remove(token.id).then(() => {
              SysLog.info('remove expiry: ', expiry.toUTCString());
            })
          }
        });
      }
    });
  };

}

import { Session } from 'mysqlx/lib/Session';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import { schemaIfc } from '../../modules/DbModule';
import {
  entities_schema,
  entities_schema_table
} from '../../schemas/entities.schema';
import { EntityDTO } from '../../dtos/entities.DTO';
import SysLog from '../../modules/SysLog';
import SysEnv from '../../modules/SysEnv';
import appDbConnection from '../../modules/AppDBModule';

export class EntityModel {
  tableName = entities_schema_table;
  schema: schemaIfc[] = entities_schema;
  requestDTO: any;
  responseDTO: any;
  siteCode = SysEnv.SITE_CODE;
  constructor(altTable?: string) {
    if (altTable) {
      this.tableName = altTable;
    }
    this.requestDTO = EntityDTO;
    this.responseDTO = EntityDTO;
    this.siteCode = SysEnv.SITE_CODE;
  }
  /**
   * function to create entity
   * @param dataInEntity entity DTO for insert
   */
  create = (dataInEntity: any, session?: Session, toCamelCase?: boolean): Promise<any> => {
    return new Promise((resolve) => {
      const newEntity = new this.requestDTO(dataInEntity, toCamelCase);

      SqlFormatter.formatInsert(
        [{ fieldName: 'site_code', value: this.siteCode }],
        newEntity,
        this.tableName,
        this.schema,
        toCamelCase
      ).then((sql) => {
        appDbConnection
          .insert(sql, session)
          .then((id) => {
            newEntity.id = id;
            resolve(newEntity);
          })
          .catch(() => {
            resolve(undefined);
          });
      });
    });
  };

  /**
   * Generic function to find data using the entity.id
   * @param entityId unique entity.id
   */
  findById = (
    entityId: string,
    session?: Session,
    toCamelCase?: boolean
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [entityId]);
      appDbConnection
        .select(sql, session)
        .then((result) => {
          if (result && result.rows && result.rows.length > 0) {
            const data = SqlFormatter.transposeResultSet(
              this.schema,
              undefined,
              undefined,
              result.rows[0],
              toCamelCase
            );
            const respEntityDTO = new this.responseDTO(data, toCamelCase);
            resolve(respEntityDTO);
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

  /**
   * Generic function to update entity by entity.id
   * @param entityId  unique entity.id
   * @param entityDTO DTO with properties to be updated
   */
  updateById = async (
    entityId: string,
    entityDTO: any,
    inputSession?: Session,
    toCamelCase?: boolean,
    excludeFields?: string[]
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, this.schema, entityDTO, toCamelCase, excludeFields).then(
        (sql) => {
          sql += SqlFormatter.formatWhereAND(
            '',
            { id: entityId },
            this.tableName,
            this.schema
          );
          appDbConnection
            .getSession(inputSession)
            .then((resp) => {
              appDbConnection
                .update(sql, resp.DBSession, false) // do not auto close the session
                .then(() => {
                  SysLog.info('updated entity: ', {
                    id: entityId,
                    ...entityDTO
                  });
                  this.findById(entityId, resp.DBSession, toCamelCase).then((respEntityDTO) => {
                    if (inputSession == undefined)
                    appDbConnection.close(resp.DBSession);
                    resolve(respEntityDTO);
                  })
                  .catch(() => {
                    if (inputSession == undefined)
                    appDbConnection.close(resp.DBSession);
                    resolve(undefined);
                  })
                })
                .catch(() => {
                  if (inputSession == undefined)
                  appDbConnection.close(resp.DBSession);
                  resolve(undefined);
                });
            })
            .catch(() => {
              resolve(undefined);
            });
        }
      );
    });
  };

  /**
   * Generic function to query database using properties in the conditions object
   * @param conditions - each property will be AND condition in the SQL
   * @param ignoreExclSelect - do not include properties that are excludeInSelect in the return DTO
   * @param excludeSelectProp - additional properties to be excluded
   */
  find = (
    conditions: any,
    showPassword?: boolean,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[],
    session?: Session,
    toCamelCase?: boolean
  ): Promise<any[]> => {
    const respEntityDTOArray: any[] = [];
    let sql = SqlFormatter.formatSelect(
      this.tableName,
      this.schema,
      ignoreExclSelect,
      excludeSelectProp
    );
    sql +=
      SqlFormatter.formatWhereAND('', conditions, this.tableName, this.schema) +
      ' AND ';
    sql = SqlFormatter.formatWhereAND(
      sql,
      { site_code: this.siteCode },
      this.tableName,
      this.schema
    );
    return new Promise((resolve) => {
      appDbConnection
        .select(sql, session)
        .then((result) => {
          if (result && result.rows && result.rows.length > 0) {
            result.rows.forEach((rowData: any) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                ignoreExclSelect,
                excludeSelectProp,
                rowData,
                toCamelCase
              );
              const respEntityDTO = new this.responseDTO(data, toCamelCase, showPassword);
              respEntityDTOArray.push(respEntityDTO);
            });
            resolve(respEntityDTOArray);
            return;
          }
          // not found with the id
          resolve(respEntityDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(respEntityDTOArray);
          return;
        });
    });
  };

  /**
   * Generic function to get all entity records based on site_code
   */
  getAll = (session?: Session,
            toCamelCase?: boolean): Promise<any[]> => {
    return new Promise((resolve) => {
      const respEntityDTOArray: any[] = [];
      let sql = SqlFormatter.formatSelect(this.tableName, this.schema);
      sql += SqlFormatter.formatWhereAND(
        '',
        { site_code: this.siteCode },
        this.tableName,
        this.schema
      );
      appDbConnection
        .select(sql, session)
        .then((result) => {
          if (result && result.rows && result.rows.length > 0) {
            result.rows.forEach((rowData: any) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData,
                toCamelCase
              );
              const respEntityDTO = new this.responseDTO(data, toCamelCase);
              respEntityDTOArray.push(respEntityDTO);
            });
            resolve(respEntityDTOArray);
            return;
          }
          // not found
          resolve(respEntityDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(respEntityDTOArray);
          return;
        });
    });
  };

  /**
   * Generic function to DELETE record from database using entity.id
   * @param id entity.id
   */
  remove = (id: string, session?: Session): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = 'DELETE FROM ' + this.tableName + ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [id]);
      appDbConnection
        .update(sql, session)
        .then((_result) => {
          SysLog.info('deleted ' + this.tableName + ' with id: ', id);
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

  /**
   * Generic function to update data status = DELETED using entity.id
   * @param id entity.id
   */
  deleteById = (id: string, session?: Session, toCamelCase?: boolean): Promise<any[]> => {
    return new Promise((resolve) => {
      const resEntityDTOArray: any[] = [];
      let sql = 'UPDATE ' + this.tableName;
      sql += ' SET status = ' + SqlStr.escape('DELETED');
      const isAliveStmt = SqlFormatter.fmtSetIsAliveIfExist(this.schema, false);
      if (isAliveStmt !== undefined) {
        sql += ', ' + isAliveStmt;
      }
      sql += ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [id]);


      appDbConnection
        .update(sql, session)
        .then((result) => {
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData,
                toCamelCase
              );
              const respEntityDTO = new this.responseDTO(data, toCamelCase);
              resEntityDTOArray.push(respEntityDTO);
            });
            resolve(resEntityDTOArray);
            return;
          } else {
            resolve(resEntityDTOArray);
          }
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resEntityDTOArray);
          return;
        });
    });
  };

  getLastUpdateSince = (
    minWhenUpdatedUsec: any,
    session?: Session,
    toCamelCase?: boolean
  ): Promise<any[] | undefined> => {
    return new Promise((resolve) => {
      const respDTOs: any[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql +=
        SqlStr.format('last_update_usec >= ?', [minWhenUpdatedUsec]) + ' AND ';
      sql = SqlFormatter.formatWhereAND(
        sql,
        { site_code: this.siteCode },
        this.tableName,
        this.schema
      );
      appDbConnection.select(sql, session)
          .then((result) => {
            if (result.rows.length) {
              result.rows.forEach((row) => {
                const data = SqlFormatter.transposeResultSet(
                  this.schema,
                  undefined,
                  undefined,
                  row,
                  toCamelCase
                );
                const respDTO = new this.responseDTO(data, toCamelCase);

                respDTOs.push(respDTO);
              });

              resolve(respDTOs);
              return;
            }
            // not found vehicle since
            resolve(respDTOs);
          })
          .catch((err) => {
            SysLog.error(JSON.stringify(err));
            resolve(respDTOs);
            return;
          });
      });
  };
}

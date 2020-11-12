/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection, { schemaIfc } from '../../modules/DbModule';
import { entities_schema } from '../../schemas/entities.schema';
import { EntityDTO } from '../../dtos/entities.DTO';
import { uuidIfc } from './uuidIfc';
import SysLog from '../../modules/SysLog';
import { isUndefined } from '../../modules/isUndefined';
import SysEnv from '../../modules/SysEnv';

export class EntityModel {
  tableName = 'entities';
  schema: schemaIfc[] = entities_schema;
  requestDTO: any;
  responseDTO: any;
  siteCode = 'TEST';
  constructor (altTable?: string) {
    if (altTable) {
        this.tableName = altTable;
    }
    this.requestDTO = EntityDTO;
    this.responseDTO = EntityDTO;
    this.siteCode = SysEnv.SITE_CODE;
  }

  create = (dataInEntity: any): Promise<any> => {
    return new Promise((resolve) => {
      const newEntity = new this.requestDTO(dataInEntity);
      newEntity.data.siteCode = this.siteCode;
      SqlFormatter.formatInsert(
        newEntity.data,
        this.tableName,
        this.schema
      ).then((sql) => {
        dbConnection.DB.query('SET @uuidId=UUID(); ', (err: any, res: any) => {
          if (err) {
            SysLog.error(JSON.stringify(err));
            const respEntityDTO = new this.responseDTO(newEntity);
            resolve(respEntityDTO);
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
                SysLog.info('created Entity: ', res);
                const newUuid: uuidIfc = res[0];
                newEntity.data.id = newUuid['@uuidId'];
                resolve(newEntity);
              }
            );
          });
        });
      });
    });
  };

  findById = (entityId: string): Promise<any | undefined> => {
    return new Promise ((resolve) => {
      let sql =
      SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [entityId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.query(sql, (err, res) => {
        if (err) {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        }
        if (res.length) {
          const respEntityDTO = new this.responseDTO(res[0]);
          resolve(respEntityDTO);
          return;
        }
        // not found Customer with the id
        resolve(undefined);
      });

    });
  };

  updateById = async (entityId: string, entityDTO: any): Promise<any | undefined> => {
    return new Promise ((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, this.schema, entityDTO).then ((sql) => {
        sql += SqlFormatter.formatWhereAND('', {id: entityId}, this.schema);
        dbConnection.DB.query( sql,
          (err, res) => {
            if (err) {
              SysLog.error(JSON.stringify(err));
              resolve(undefined);
              return;
            }
            if (res.affectedRows == 0) {
              // not found entity with the id
              resolve(undefined);
              return;
            }
            SysLog.info('updated entity: ', { id: entityId, ...entityDTO });
            this.findById(entityId).then((respEntityDTO) => {
              resolve(respEntityDTO);
            })
          }
        );
      });
      });
  };

  find = (
    conditions: any,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[]
  ): Promise<any[] | undefined> => {
    let sql = SqlFormatter.formatSelect(
      this.tableName,
      this.schema,
      ignoreExclSelect,
      excludeSelectProp
    );
    sql += SqlFormatter.formatWhereAND('', conditions, this.schema);
    SysLog.info('find SQL: ' + sql);
    return new Promise((resolve) => {
      dbConnection.DB.query(sql, (err, res) => {
        if (err) {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        }
        if (res.length) {
          const respEntityDTOArray: any[] = [];
          res.forEach((data: any) => {
            const respEntityDTO = new this.responseDTO(data);
            respEntityDTOArray.push(respEntityDTO);
          });
          resolve(respEntityDTOArray);
          return;
        }
        // not found with the id
        resolve(undefined);
      });
    });
  };


  getAll = (): Promise<any[] | undefined> => {
    return new Promise ((resolve) => {
      dbConnection.DB.query(
        SqlFormatter.formatSelect(this.tableName, this.schema),
        (err, res) => {
          if (err) {
            SysLog.error(JSON.stringify(err));
            resolve(undefined);
            return;
          }
          if (res.length) {
            const respEntityDTOArray:any[] = [];
            res.forEach((data: any) => {
              const respEntityDTO = new this.responseDTO(data);
              respEntityDTOArray.push(respEntityDTO);
            });
            resolve (respEntityDTOArray);
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
        'DELETE FROM entities WHERE id = UUID_TO_BIN(?);',
        id,
        (err, res) => {
          if (err) {
            SysLog.error(JSON.stringify(err));
            resolve(undefined);
            return;
          }
          if (res.affectedRows == 0) {
            // not found Customer with the id
            resolve(undefined);
            return;
          }
          SysLog.info('deleted entities with id: ', id);
          resolve(id);
        }
      );
    });
  };

}

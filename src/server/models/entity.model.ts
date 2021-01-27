/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection, { schemaIfc } from '../../modules/DbModule';
import { entities_schema, entities_schema_table } from '../../schemas/entities.schema';
import { EntityDTO } from '../../dtos/entities.DTO';
import { uuidIfc } from './uuidIfc';
import SysLog from '../../modules/SysLog';
import SysEnv from '../../modules/SysEnv';

export class EntityModel {
  tableName = entities_schema_table;
  schema: schemaIfc[] = entities_schema;
  requestDTO: any;
  responseDTO: any;
  siteCode = SysEnv.SITE_CODE;
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
      newEntity.data.site_code = this.siteCode;
      SqlFormatter.formatInsert(
        newEntity.data,
        this.tableName,
        this.schema
      ).then((sql) => {
        dbConnection.DB.sql('SET @uuidId=UUID(); ').execute()
        .then((result) => {
          dbConnection.DB.sql(sql).execute()
          .then((result2) => {
            dbConnection.DB.sql('SELECT @uuidId;').execute()
            .then((result3) => {
              SysLog.info('created Entity: ', result3);
              const newUuid: uuidIfc = { '@uuidId': result3.rows[0][0] }; // TODO
              newEntity.data.id = newUuid['@uuidId'];
              resolve(newEntity);
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
          const respEntityDTO = new this.responseDTO(newEntity);
          resolve(respEntityDTO);
          return;
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
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length) {
          const data = SqlFormatter.transposeResultSet(this.schema,
            undefined,
            undefined,
            result.rows[0]);
          const respEntityDTO = new this.responseDTO(data);
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
      })

    });
  };

  updateById = async (entityId: string, entityDTO: any): Promise<any | undefined> => {
    return new Promise ((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, this.schema, entityDTO).then ((sql) => {
        sql += SqlFormatter.formatWhereAND('', {id: entityId}, this.tableName, this.schema);
        dbConnection.DB.sql(sql).execute()
        .then((result) => {
          SysLog.info('updated entity: ', { id: entityId, ...entityDTO });
          this.findById(entityId).then((respEntityDTO) => {
            resolve(respEntityDTO);
          })
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
      });
    });
  };

  find = (
    conditions: any,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[]
  ): Promise<any[]> => {
    const respEntityDTOArray: any[] = [];
    let sql = SqlFormatter.formatSelect(
      this.tableName,
      this.schema,
      ignoreExclSelect,
      excludeSelectProp
    );
    sql += SqlFormatter.formatWhereAND('', conditions,  this.tableName, this.schema);
    SysLog.info('find SQL: ' + sql);
    return new Promise((resolve) => {
      dbConnection.DB.sql(sql).execute()
      .then((result) => {

        if (result.rows.length) {

          result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeResultSet(this.schema,
              ignoreExclSelect,
              excludeSelectProp,
              rowData);
            const respEntityDTO = new this.responseDTO(data);
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


  getAll = (): Promise<any[] | undefined> => {
    return new Promise ((resolve) => {
      dbConnection.DB.sql(SqlFormatter.formatSelect(this.tableName, this.schema)).execute()
      .then((result) => {
        const respEntityDTOArray:any[] = [];
        if (result.rows.length) {

          result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeResultSet(this.schema,
              undefined,
              undefined,
              rowData);
            const respEntityDTO = new this.responseDTO(data);
            respEntityDTOArray.push(respEntityDTO);
          });
          resolve (respEntityDTOArray);
          return;
        }
        // not found
        resolve(respEntityDTOArray);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    });
  };

  remove = (id: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = 'DELETE FROM ' + this.tableName + ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [id]);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
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

}

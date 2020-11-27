/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection, { schemaIfc } from '../../modules/DbModule';
import { properties_schema, properties_schema_table } from '../../schemas/properties.schema';
import { PropertyDTO } from '../../dtos/properties.DTO';
import { uuidIfc } from './uuidIfc';
import SysLog from '../../modules/SysLog';
import SysEnv from '../../modules/SysEnv';

export class PropertyModel {
  tableName = properties_schema_table;
  schema: schemaIfc[] = properties_schema;
  requestDTO: any;
  responseDTO: any;
  siteCode = SysEnv.SITE_CODE;
  constructor (altTable?: string) {
    if (altTable) {
        this.tableName = altTable;
    }
    this.requestDTO = PropertyDTO;
    this.responseDTO = PropertyDTO;
    this.siteCode = SysEnv.SITE_CODE;
  }

  create = (dataInProperty: any): Promise<any> => {
    return new Promise((resolve) => {
      const newProperty = new this.requestDTO(dataInProperty);
      newProperty.data.site_code = this.siteCode;
      SqlFormatter.formatInsert(
        newProperty.data,
        this.tableName,
        this.schema
      ).then((sql) => {
        dbConnection.DB.sql('SET @uuidId=UUID(); ').execute()
        .then((result) => {
          dbConnection.DB.sql(sql).execute()
          .then((result2) => {
            dbConnection.DB.sql('SELECT @uuidId;').execute()
            .then((result3) => {
              SysLog.info('created Property: ', result3);
              const newUuid: uuidIfc = { '@uuidId': result3.rows[0][0] }; // TODO
              newProperty.data.id = newUuid['@uuidId'];
              resolve(newProperty);
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
          const respPropertyDTO = new this.responseDTO(newProperty);
          resolve(respPropertyDTO);
          return;
        });
      });
    });
  };

  findById = (propertyId: string): Promise<any | undefined> => {
    return new Promise ((resolve) => {
      let sql =
      SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [propertyId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length) {
          const data = SqlFormatter.transposeResultSet(this.schema,
            undefined,
            undefined,
            result.rows[0]);
          const respPropertyDTO = new this.responseDTO(data);
          resolve(respPropertyDTO);
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

  updateById = async (propertyId: string, propertyDTO: any): Promise<any | undefined> => {
    return new Promise ((resolve) => {
      SqlFormatter.formatUpdate(this.tableName, this.schema, propertyDTO).then ((sql) => {
        sql += SqlFormatter.formatWhereAND('', {id: propertyId}, this.schema);
        dbConnection.DB.sql(sql).execute()
        .then((result) => {
          SysLog.info('updated property: ', { id: propertyId, ...propertyDTO });
          this.findById(propertyId).then((respPropertyDTO) => {
            resolve(respPropertyDTO);
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
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length) {
          const respPropertyDTOArray: any[] = [];
          result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeResultSet(this.schema,
              ignoreExclSelect,
              excludeSelectProp,
              rowData);
            const respPropertyDTO = new this.responseDTO(data);
            respPropertyDTOArray.push(respPropertyDTO);
          });
          resolve(respPropertyDTOArray);
          return;
        }
        // not found with the id
        resolve(undefined);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    });
  };


  getAll = (): Promise<any[] | undefined> => {
    return new Promise ((resolve) => {
      dbConnection.DB.sql(SqlFormatter.formatSelect(this.tableName, this.schema)).execute()
      .then((result) => {
        if (result.rows.length) {
          const respPropertyDTOArray:any[] = [];
          result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeResultSet(this.schema,
              undefined,
              undefined,
              rowData);
            const respPropertyDTO = new this.responseDTO(data);
            respPropertyDTOArray.push(respPropertyDTO);
          });
          resolve (respPropertyDTOArray);
          return;
        }
        // not found
        resolve(undefined);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    });
  };

  remove = (id: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
      let sql = 'DELETE FROM properties WHERE ';
      sql += SqlStr.format('id = UUID_TO_BIN(?)', [id]);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length == 0) {
          // not found Customer with the id
          resolve(undefined);
          return;
        }
        SysLog.info('deleted properties with id: ', id);
        resolve(id);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    });
  };

}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { advertisements_schema, advertisements_schema_table } from '../../schemas/advertisements.schema';
import { AdvertisementDTO } from '../../dtos/advertisements.DTO';
import { EntityModel } from './entity.model';
import SqlFormatter from '../../modules/sql.strings';
import SysLog from '../../modules/SysLog';
import dbConnection from '../../modules/DbModule';
import SqlStr = require('sqlstring');

export class AdvertisementModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = advertisements_schema_table;
    }
    this.requestDTO = AdvertisementDTO;
    this.responseDTO = AdvertisementDTO;
    this.schema = advertisements_schema;
  }
  findKeyword = (
    siteCode: string,
    searchStr: string,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[]
  ): Promise<any[] | undefined> => {
    let sql = SqlFormatter.formatSelect(
      this.tableName,
      this.schema,
      ignoreExclSelect,
      excludeSelectProp
    );
    sql += ' WHERE site_code='+SqlStr.escape(siteCode) + ' AND ';
    sql += ' header LIKE ' + SqlStr.escape('%'+searchStr+'%')+';';

    SysLog.info('find SQL: ' + sql);
    return new Promise((resolve) => {
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length) {
          const respEntityDTOArray: any[] = [];
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
        resolve(undefined);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    });

  }

  }

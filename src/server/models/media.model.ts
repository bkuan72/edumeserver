import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { medias_schema, medias_schema_table } from '../../schemas/medias.schema';
import { MediaDTO } from '../../dtos/medias.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import dbConnection from '../../modules/DbModule';

export class MediaModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = medias_schema_table;
    }
    this.requestDTO = MediaDTO;
    this.responseDTO = MediaDTO;
    this.schema = medias_schema;
  }

  findByUserId = (
    userId: string
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]);
      SysLog.info('findByUserId SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          const resMediaDTOArray: MediaDTO[] = [];
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respMediaDTO = new this.responseDTO(data) as MediaDTO;
              resMediaDTOArray.push(respMediaDTO.data);
            });
            resolve(resMediaDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resMediaDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };

}

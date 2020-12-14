import { CommonFn } from './../../modules/CommonFnModule';
import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  groups_schema,
  groups_schema_table
} from '../../schemas/groups.schema';
import { GroupDTO } from '../../dtos/groups.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import dbConnection from '../../modules/DbModule';
import DTOGenerator from '../../modules/ModelGenerator';

export class GroupModel extends EntityModel {
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = groups_schema_table;
    }
    this.requestDTO = GroupDTO;
    this.responseDTO = GroupDTO;
    this.schema = groups_schema;
  }

  findByAccountId = (
    postId: string
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('account_id = UUID_TO_BIN(?)', [postId]) ;
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          const resGroupDTOArray: GroupDTO[] = [];
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respGroupDTO = new this.responseDTO(data) as GroupDTO;
              respGroupDTO.data = DTOGenerator.defineProperty(respGroupDTO.data, 'media', {
                                                                    type: respGroupDTO.data.type,
                                                                    preview: respGroupDTO.data.preview

                                                                });
              resGroupDTOArray.push(respGroupDTO.data);
            });
            resolve(resGroupDTOArray);
            return;
          }

          resolve(resGroupDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };
}

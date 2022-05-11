import { GroupData } from '../../schemas/groups.schema';
import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  socialGroups_schema,
  socialGroups_schema_table
} from '../../schemas/groups.schema';
import { GroupDTO } from '../../dtos/groups.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import appDbConnection from '../../modules/AppDBModule';
import DTOGenerator from '../../modules/ModelGenerator';

export class GroupModel extends EntityModel {
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = socialGroups_schema_table;
    }
    this.requestDTO = GroupDTO;
    this.responseDTO = GroupDTO;
    this.schema = socialGroups_schema;
  }

  findByAccountId = (
    postId: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resGroupDTOArray: GroupDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('account_id = UUID_TO_BIN(?)', [postId]) ;
       appDbConnection.select(sql)
        .then((result) => {

          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              let respGroupDTO = new this.responseDTO(data) as GroupDTO | GroupData;
              respGroupDTO = DTOGenerator.defineProperty(respGroupDTO, 'medias', [{
                                                                    type: respGroupDTO.type,
                                                                    preview: respGroupDTO.preview

                                                                }]);
              resGroupDTOArray.push(respGroupDTO);
            });
            resolve(resGroupDTOArray);
            return;
          } else {
            resolve(resGroupDTOArray);
          }
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resGroupDTOArray);
          return;
        });
      });
  };
}

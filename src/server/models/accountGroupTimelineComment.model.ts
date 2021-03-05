import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import dbConnection from '../../modules/DbModule';
import { accountGroupTimelineComments_schema, accountGroupTimelineComments_schema_table } from '../../schemas/accountGroupTimelineComments.schema';
import { AccountGroupTimelineCommentDTO, AccountGroupTimelineUserCommentDTO } from '../../dtos/accountGroupTimelineComments.DTO';

export class AccountGroupTimelineCommentModel extends EntityModel {
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = accountGroupTimelineComments_schema_table;
    }
    this.requestDTO = AccountGroupTimelineCommentDTO;
    this.responseDTO = AccountGroupTimelineCommentDTO;
    this.schema = accountGroupTimelineComments_schema;
  }

  findByTimelineId = (
    timelineId: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resTimelineDTOArray: AccountGroupTimelineCommentDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('timeline_id = UUID_TO_BIN(?)', [timelineId])  + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED');
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {

          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respTimelineDTO = new AccountGroupTimelineUserCommentDTO(data);
              resTimelineDTOArray.push(respTimelineDTO);
            });
            resolve(resTimelineDTOArray);
            return;
          }

          resolve(resTimelineDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resTimelineDTOArray);
          return;
        });
    });
  };
}

import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  userTimelineComments_schema,
  userTimelineComments_schema_table
} from '../../schemas/userTimelineComments.schema';
import { UserTimelineCommentDTO, UserTimelineUserCommentDTO } from '../../dtos/userTimelineComments.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import appDbConnection from '../../modules/AppDBModule';

export class UserTimelineCommentModel extends EntityModel {
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = userTimelineComments_schema_table;
    }
    this.requestDTO = UserTimelineCommentDTO;
    this.responseDTO = UserTimelineCommentDTO;
    this.schema = userTimelineComments_schema;
  }

  findByTimelineId = (
    timelineId: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resTimelineDTOArray: UserTimelineCommentDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('timeline_id = UUID_TO_BIN(?)', [timelineId])  + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED');
      SysLog.info('findById SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
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
              const respTimelineDTO = new UserTimelineUserCommentDTO(data);
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

    });
  };
}

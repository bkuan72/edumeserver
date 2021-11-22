import { AccountGroupTimelineData } from '../../schemas/accountGroupTimelines.schema';
import { posts_schema, posts_schema_table } from '../../schemas/posts.schema';
import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  accountGroupTimelines_schema,
  accountGroupTimelines_schema_table
} from '../../schemas/accountGroupTimelines.schema';
import { AccountGroupTimelineDTO, TimelinePostDTO, AccountGroupTimelinePostData } from '../../dtos/accountGroupTimelines.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import appDbConnection from '../../modules/AppDBModule';
import DTOGenerator from '../../modules/ModelGenerator';
import CommonFn, { DateAddIntervalEnum } from '../../modules/CommonFnModule';

export class AccountGroupTimelineModel extends EntityModel {
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = accountGroupTimelines_schema_table;
    }
    this.requestDTO = AccountGroupTimelineDTO;
    this.responseDTO = AccountGroupTimelineDTO;
    this.schema = accountGroupTimelines_schema;
  }

  findByTimelineId = (
    timelineId: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resAccountGroupTimelineDTOArray: AccountGroupTimelineDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('timeline_id = UUID_TO_BIN(?)', [timelineId]) ;
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
              let respAccountGroupTimelineDTO = new this.responseDTO(data) as AccountGroupTimelineDTO | AccountGroupTimelineData;
              respAccountGroupTimelineDTO = DTOGenerator.defineProperty(respAccountGroupTimelineDTO, 'medias', [{
                                                                    type: respAccountGroupTimelineDTO.type,
                                                                    preview: respAccountGroupTimelineDTO.preview

                                                                }]);
              resAccountGroupTimelineDTOArray.push(respAccountGroupTimelineDTO);
            });
            resolve(resAccountGroupTimelineDTOArray);
            return;
          }

          resolve(resAccountGroupTimelineDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resAccountGroupTimelineDTOArray);
          return;
        });
      });

    });
  };


  findAccountTimeline = (
    accountId: string,
    offSetDays: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const fromDate = CommonFn.dateDeduct(
        new Date(),
        DateAddIntervalEnum.DAY,
        parseInt(offSetDays)
      );
      const resPostDTOArray: AccountGroupTimelineDTO[] = [];

      let sql = 'SELECT ' + SqlFormatter.formatTableSelect(this.tableName, this.schema) + ', ';
      sql += SqlFormatter.formatTableSelect(posts_schema_table, posts_schema);
      sql += ' FROM ' + this.tableName;
      sql += ' INNER JOIN ' + posts_schema_table + ' ON ';
      sql += SqlFormatter.fmtTableFieldStr(posts_schema_table, 'id') + ' = ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'post_id');
      sql += ' WHERE ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + ' = ' + SqlStr.escape(this.siteCode) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ' != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'lastUpdateUsec') + ' >= ' + fromDate?.valueOf() + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'account_id') + ' = ' + SqlStr.format('UUID_TO_BIN(?)', [accountId]) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') + ' = 0';
      sql += ' ORDER BY ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'lastUpdateUsec') + ' DESC ';
      sql += ';';
      SysLog.info('findByTimelineAccountGroupId SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
        DBSession.sql(sql)
        .execute()
        .then((result) => {

         if (result.rows.length > 0) {
            result.rows.forEach((rowData) => {
              const respTimelinePostDTO = new TimelinePostDTO() as AccountGroupTimelinePostData;
              let colIdx = 0;
              colIdx = SqlFormatter.transposeTableSelectColumns(colIdx,
                                                                respTimelinePostDTO,
                                                                this.schema,
                                                                rowData);
              colIdx = SqlFormatter.transposeTableSelectColumns(colIdx,
                                                                respTimelinePostDTO.post,
                                                                posts_schema,
                                                                rowData);

              resPostDTOArray.push(respTimelinePostDTO);
            });
            resolve(resPostDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resPostDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resPostDTOArray);
          return;
        });
      });

    });
  };

  findGroupTimeline = (
    groupId: string,
    offSetDays: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const fromDate = CommonFn.dateDeduct(
        new Date(),
        DateAddIntervalEnum.DAY,
        parseInt(offSetDays)
      );
      const resPostDTOArray: AccountGroupTimelineDTO[] = [];

      let sql = 'SELECT ' + SqlFormatter.formatTableSelect(this.tableName, this.schema) + ', ';
      sql += SqlFormatter.formatTableSelect(posts_schema_table, posts_schema);
      sql += ' FROM ' + this.tableName;
      sql += ' INNER JOIN ' + posts_schema_table + ' ON ';
      sql += SqlFormatter.fmtTableFieldStr(posts_schema_table, 'id') + ' = ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'post_id');
      sql += ' WHERE ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + ' = ' + SqlStr.escape(this.siteCode) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ' != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'lastUpdateUsec') + ' >= ' + fromDate?.valueOf() + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'group_id') + ' = ' + SqlStr.format('UUID_TO_BIN(?)', [groupId]);
      sql += ' ORDER BY ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'lastUpdateUsec') + ' DESC ';
      sql += ';';
      SysLog.info('findByTimelineAccountGroupId SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
        DBSession.sql(sql)
        .execute()
        .then((result) => {

         if (result.rows.length > 0) {
            result.rows.forEach((rowData) => {
              const respTimelinePostDTO = new TimelinePostDTO() as AccountGroupTimelinePostData;
              let colIdx = 0;
              colIdx = SqlFormatter.transposeTableSelectColumns(colIdx,
                                                                respTimelinePostDTO,
                                                                this.schema,
                                                                rowData);
              colIdx = SqlFormatter.transposeTableSelectColumns(colIdx,
                                                                respTimelinePostDTO.post,
                                                                posts_schema,
                                                                rowData);

              resPostDTOArray.push(respTimelinePostDTO);
            });
            resolve(resPostDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resPostDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resPostDTOArray);
          return;
        });
      });

    });
  };


  incrementLikesById = (
    timelineId: string
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = '';
      sql = 'UPDATE ' + this.tableName;
      sql +=' SET likes  = likes + 1 ';
      sql += SqlFormatter.formatWhereAND(
        '',
        { id: timelineId },
        this.tableName,
        this.schema
      );
      SysLog.info("Increment Sql Likes : " + sql)
      appDbConnection.connectDB().then((DBSession) => {
        DBSession.sql(sql)
        .execute()
        .then((result) => {
          SysLog.info('likes post : ', { id: timelineId });
          this.findById(timelineId).then((respPostDTO) => {
            resolve(respPostDTO);
          });
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
      });

    });
  };

  decrementLikesById = (
    timelineId: string
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = '';
      sql = 'UPDATE ' + this.tableName;
      sql +=' SET likes  = likes - 1 ';
      sql += SqlFormatter.formatWhereAND(
        '',
        { id: timelineId },
        this.tableName,
        this.schema
      );
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          SysLog.info('unlike post: ', { id: timelineId });
          this.findById(timelineId).then((respPostDTO) => {
            resolve(respPostDTO);
          });
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
      });

    });
  };
  incrementShareById = (timelineId: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = '';
      sql = 'UPDATE ' + SqlStr.escape(this.tableName);
      sql =
        ' SET ' +
        SqlStr.escape('share') +
        ' = ' +
        SqlStr.escape('share') +
        ' + 1 ';
      sql += SqlFormatter.formatWhereAND(
        '',
        { id: timelineId },
        this.tableName,
        this.schema
      );
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          SysLog.info('updated timeline post share: ', { id: timelineId });
          this.findById(timelineId).then((respPostDTO) => {
            resolve(respPostDTO);
          });
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
      });

    });
  };


}

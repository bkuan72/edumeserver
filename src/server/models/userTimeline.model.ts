import { posts_schema, posts_schema_table } from './../../schemas/posts.schema';
import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  userTimelines_schema,
  userTimelines_schema_table
} from '../../schemas/userTimelines.schema';
import { UserTimelineDTO, TimelinePostDTO } from '../../dtos/userTimelines.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import dbConnection from '../../modules/DbModule';
import DTOGenerator from '../../modules/ModelGenerator';
import CommonFn, { DateAddIntervalEnum } from '../../modules/CommonFnModule';

export class UserTimelineModel extends EntityModel {
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = userTimelines_schema_table;
    }
    this.requestDTO = UserTimelineDTO;
    this.responseDTO = UserTimelineDTO;
    this.schema = userTimelines_schema;
  }

  findByTimelineId = (
    timelineId: string
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('timeline_id = UUID_TO_BIN(?)', [timelineId]) ;
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          const resUserTimelineDTOArray: UserTimelineDTO[] = [];
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respUserTimelineDTO = new this.responseDTO(data) as UserTimelineDTO;
              respUserTimelineDTO.data = DTOGenerator.defineProperty(respUserTimelineDTO.data, 'media', {
                                                                    type: respUserTimelineDTO.data.type,
                                                                    preview: respUserTimelineDTO.data.preview

                                                                });
              resUserTimelineDTOArray.push(respUserTimelineDTO.data);
            });
            resolve(resUserTimelineDTOArray);
            return;
          }

          resolve(resUserTimelineDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };


  findTimeline = (
    userId: string,
    offSetDays: string
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      const fromDate = CommonFn.dateDeduct(
        new Date(),
        DateAddIntervalEnum.DAY,
        parseInt(offSetDays)
      );
      const resPostDTOArray: UserTimelineDTO[] = [];

      let sql = 'SELECT ' + SqlFormatter.formatTableSelect(this.tableName, this.schema) + ', ';
      sql += SqlFormatter.formatTableSelect(posts_schema_table, posts_schema);
      sql += ' FROM ' + this.tableName;
      sql += ' INNER JOIN ' + posts_schema_table + ' ON ';
      sql += SqlFormatter.fmtTableFieldStr(posts_schema_table, 'id') + ' = ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'post_id');
      sql += ' WHERE ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'site_code') + ' = ' + SqlStr.escape(this.siteCode) + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'status') + ' != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'lastUpdateUsec') + ' >= ' + fromDate?.valueOf() + ' AND ';
      sql += SqlFormatter.fmtTableFieldStr(this.tableName, 'timeline_user_id') + ' = ' + SqlStr.format('UUID_TO_BIN(?)', [userId]);
      sql += ' ORDER BY ' + SqlFormatter.fmtTableFieldStr(this.tableName, 'lastUpdateUsec') + ' DESC ';
      sql += ';';
      SysLog.info('findByTimelineUserId SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {

         if (result.rows.length > 0) {
            result.rows.forEach((rowData) => {
              const respTimelinePostDTO = new TimelinePostDTO();
              let colIdx = 0;
              colIdx = SqlFormatter.transposeTableSelectColumns(colIdx,
                                                                respTimelinePostDTO.data,
                                                                this.schema,
                                                                rowData);
              colIdx = SqlFormatter.transposeTableSelectColumns(colIdx,
                                                                respTimelinePostDTO.data.post,
                                                                posts_schema,
                                                                rowData);

              resPostDTOArray.push(respTimelinePostDTO.data);
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
      dbConnection.DB.sql(sql)
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
      dbConnection.DB.sql(sql)
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
      dbConnection.DB.sql(sql)
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
  };


}

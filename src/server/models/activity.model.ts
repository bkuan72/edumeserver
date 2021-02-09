import { CommonFn, DateAddIntervalEnum } from './../../modules/CommonFnModule';
import { FriendModel } from './friend.model';
import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { activities_schema, activities_schema_table } from '../../schemas/activities.schema';
import { ActivityDTO } from '../../dtos/activities.DTO';
import { EntityModel } from './entity.model';
import dbConnection from '../../modules/DbModule';
import SysLog from '../../modules/SysLog';
import SqlStr = require('sqlstring');

export class ActivityModel extends EntityModel {
  friends: FriendModel;
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = activities_schema_table;
    }
    this.requestDTO = ActivityDTO;
    this.responseDTO = ActivityDTO;
    this.schema = activities_schema;
    this.friends = new FriendModel();
  }

  findByTimelineUserId = (
    timelineUserId: string,
    offSetDays: string
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      const fromDate = CommonFn.dateDeduct(new Date(), DateAddIntervalEnum.DAY, parseInt(offSetDays));
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('timeline_user_id = UUID_TO_BIN(?)', [timelineUserId]) + ' AND ';
      sql += 'status != '+ SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('lastUpdateUsec >= ?', [fromDate?.valueOf()]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          const resActivityDTOArray: ActivityDTO[] = [];
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respActivityDTO = new this.responseDTO(data) as ActivityDTO;
              resActivityDTOArray.push(respActivityDTO);
            });
            resolve(resActivityDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resActivityDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };

  findByTypeTimelineIdUserId = (
    activityType: string,
    timelineId: string,
    userId: string
  ): Promise<ActivityDTO[]> => {
    return new Promise((resolve, reject) => {
      const resActivityDTOArray: ActivityDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += 'activity_type = ' + SqlStr.escape(activityType) + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]) + ' AND ';
      sql += SqlStr.format('timeline_id = UUID_TO_BIN(?)', [timelineId]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {

          if (result.rows.length > 0) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respActivityDTO = new this.responseDTO(data) as ActivityDTO;
              resActivityDTOArray.push(respActivityDTO);
            });
            resolve(resActivityDTOArray);
            return;
          }
          // not found
          resolve(resActivityDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          reject(resActivityDTOArray);
          return;
        });
    });
  };

}

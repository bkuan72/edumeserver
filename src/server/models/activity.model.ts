import { CommonFn, DateAddIntervalEnum } from './../../modules/CommonFnModule';
import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { activities_schema, activities_schema_table } from '../../schemas/activities.schema';
import { ActivityDTO } from '../../dtos/activities.DTO';
import { EntityModel } from './entity.model';
import appDbConnection from '../../modules/AppDBModule';
import SysLog from '../../modules/SysLog';
import SqlStr = require('sqlstring');

export class ActivityModel extends EntityModel {
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
  }

  findByTimelineUserId = (
    timelineUserId: string,
    offSetDays: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resActivityDTOArray: ActivityDTO[] = [];
      const fromDate = CommonFn.dateDeduct(new Date(), DateAddIntervalEnum.DAY, parseInt(offSetDays));
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('timeline_user_id = UUID_TO_BIN(?)', [timelineUserId]) + ' AND ';
      sql += 'status != '+ SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('last_update_usec >= ?', [fromDate?.valueOf()]);
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
              const respActivityDTO = new this.responseDTO(data) as ActivityDTO;
              resActivityDTOArray.push(respActivityDTO);
            });
            resolve(resActivityDTOArray);
            return;
          } else { 
          resolve(resActivityDTOArray);
          }

        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resActivityDTOArray);
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
      appDbConnection.select(sql)
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
          } else {
          // not found
          resolve(resActivityDTOArray);
          }

        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          reject(resActivityDTOArray);
          return;
        });
      });
  };


  addFriendRequest(friends: any): Promise<void> {
    return new Promise((resolve, reject) => {
        this.create({
          timeline_user_id: friends.friend_id,
          user_id: friends.user_id,
          friends_id: friends.id,
          activity_type: 'FRIEND_REQUEST',
          message: 'Want to Add you to their Contact.',
          activity_date: new Date().toISOString()
        }).then((activityDTO) => {
          resolve(activityDTO);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          reject(undefined)
        });
    });
  }

  addAccountMemberRequest(member: any): Promise<void> {
    return new Promise((resolve, reject) => {
        this.create({
          timeline_user_id: member.user_id,
          account_id: member.account_id,
          member_id: member.id,
          activity_type: 'ACC_MEMBER_REQ',
          message: 'Want to Add you as Member.',
          activity_date: new Date().toISOString()
        }).then((activityDTO) => {
          resolve(activityDTO);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          reject(undefined)
        });
    });
  }

  addGroupMemberRequest(member: any): Promise<void> {
    return new Promise((resolve, reject) => {
        this.create({
          timeline_user_id: member.user_id,
          account_id: member.account_id,
          group_id: member.group_id,
          member_id: member.id,
          activity_type: 'GRP_MEMBER_REQ',
          message: 'Want to Add you as Member.',
          activity_date: new Date().toISOString()
        }).then((activityDTO) => {
          resolve(activityDTO);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          reject(undefined)
        });
    });
  }
}

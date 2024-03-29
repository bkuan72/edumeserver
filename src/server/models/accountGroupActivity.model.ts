import { CommonFn, DateAddIntervalEnum } from '../../modules/CommonFnModule';
import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { accountGroupActivities_schema, accountGroupActivities_schema_table } from '../../schemas/accountGroupActivities.schema';
import { AccountGroupActivityDTO } from '../../dtos/accountGroupActivities.DTO';
import appDbConnection from '../../modules/AppDBModule';
import SysLog from '../../modules/SysLog';
import SqlStr = require('sqlstring');
import { ActivityModel } from './activity.model';
import { EntityModel } from './entity.model';
import e = require('express');

export class AccountGroupActivityModel extends EntityModel {

  private userActivityModel = new ActivityModel();

  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = accountGroupActivities_schema_table;
    }
    this.requestDTO = AccountGroupActivityDTO;
    this.responseDTO = AccountGroupActivityDTO;
    this.schema = accountGroupActivities_schema;
  }

  findByTimelineAccountId = (
    timelineAccountId: string,
    offSetDays: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resAccountGroupActivityDTOArray: AccountGroupActivityDTO[] = [];
      const fromDate = CommonFn.dateDeduct(new Date(), DateAddIntervalEnum.DAY, parseInt(offSetDays));
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('timeline_account_id = UUID_TO_BIN(?)', [timelineAccountId]) + ' AND ';
      sql += 'timeline_group_id = 0 AND ';
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
              const respAccountGroupActivityDTO = new this.responseDTO(data) as AccountGroupActivityDTO;
              resAccountGroupActivityDTOArray.push(respAccountGroupActivityDTO);
            });
            resolve(resAccountGroupActivityDTOArray);
            return;
          } else {
          // not found Customer with the id
          resolve(resAccountGroupActivityDTOArray);
          }

        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resAccountGroupActivityDTOArray);
          return;
        });
      });
  };

  findByTypeTimelineIdUserId = (
    activityType: string,
    timelineId: string,
    userId: string
  ): Promise<AccountGroupActivityDTO[]> => {
    return new Promise((resolve, reject) => {
      const resAccountGroupActivityDTOArray: AccountGroupActivityDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += 'activity_type = ' + SqlStr.escape(activityType) + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]) + ' AND ';
      sql += 'group_id = 0 AND ';
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
              const respAccountGroupActivityDTO = new this.responseDTO(data) as AccountGroupActivityDTO;
              resAccountGroupActivityDTOArray.push(respAccountGroupActivityDTO);
            });
            resolve(resAccountGroupActivityDTOArray);
            return;
          } else {
          // not found
          resolve(resAccountGroupActivityDTOArray);
          }

        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          reject(resAccountGroupActivityDTOArray);
          return;
        });
      });
  };


  findByTimelineGroupId = (
    timelineGroupId: string,
    offSetDays: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resAccountGroupActivityDTOArray: AccountGroupActivityDTO[] = [];
      const fromDate = CommonFn.dateDeduct(new Date(), DateAddIntervalEnum.DAY, parseInt(offSetDays));
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('timeline_group_id = UUID_TO_BIN(?)', [timelineGroupId]) + ' AND ';
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
              const respAccountGroupActivityDTO = new this.responseDTO(data) as AccountGroupActivityDTO;
              resAccountGroupActivityDTOArray.push(respAccountGroupActivityDTO);
            });
            resolve(resAccountGroupActivityDTOArray);
            return;
          } else {
          resolve(resAccountGroupActivityDTOArray);
          }

        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resAccountGroupActivityDTOArray);
          return;
        });
      });
  };

  findByTypeTimelineIdGroupId = (
    activityType: string,
    timelineId: string,
    groupId: string
  ): Promise<AccountGroupActivityDTO[]> => {
    return new Promise((resolve, reject) => {
      const resAccountGroupActivityDTOArray: AccountGroupActivityDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += 'activity_type = ' + SqlStr.escape(activityType) + ' AND ';
      sql += SqlStr.format('group_id = UUID_TO_BIN(?)', [groupId]) + ' AND ';
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
              const respAccountGroupActivityDTO = new this.responseDTO(data) as AccountGroupActivityDTO;
              resAccountGroupActivityDTOArray.push(respAccountGroupActivityDTO);
            });
            resolve(resAccountGroupActivityDTOArray);
            return;
          } else {
          // not found
          resolve(resAccountGroupActivityDTOArray);
          }

        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          reject(resAccountGroupActivityDTOArray);
          return;
        });
      });
  };

  createMemberRequest(memberRequest: any): Promise<any> {
    return new Promise ((resolve, reject) => {
      resolve({});
    });
  }



  addAccountMemberRequest(member: any): Promise<void> {
    return new Promise((resolve, reject) => {
        this.userActivityModel.addAccountMemberRequest(member).then((activityDTO) => {
          resolve(activityDTO);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          reject(undefined)
        });
    });
  }


}

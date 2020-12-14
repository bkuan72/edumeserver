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

  findByUserId = (
    userId: string,
    offSetDays: string
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]) + ' AND ';
      sql += SqlStr.format('lastUpdateUsec >= ?', [parseInt(offSetDays)]);
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
              resActivityDTOArray.push(respActivityDTO.data);
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

}

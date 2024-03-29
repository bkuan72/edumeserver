import CommonFn, { DateAddIntervalEnum } from '../../modules/CommonFnModule';
import { FriendModel } from './friend.model';
import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { posts_schema, posts_schema_table } from '../../schemas/posts.schema';
import { PostDTO } from '../../dtos/posts.DTO';
import { EntityModel } from './entity.model';
import appDbConnection from '../../modules/AppDBModule';
import SysLog from '../../modules/SysLog';
import SqlStr = require('sqlstring');
import DTOGenerator from '../../modules/ModelGenerator';


export class PostModel extends EntityModel {
  friends: FriendModel;
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = posts_schema_table;
    }
    this.requestDTO = PostDTO;
    this.responseDTO = PostDTO;
    this.schema = posts_schema;
    this.friends = new FriendModel();
  }

  findByUserId = (
    userId: string,
    offSetDays: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resPostDTOArray: PostDTO[] = [];
      const fromDate = CommonFn.dateDeduct(
        new Date(),
        DateAddIntervalEnum.DAY,
        parseInt(offSetDays)
      );
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]) + ' AND ';
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
              const respPostDTO = new this.responseDTO(data) as PostDTO;
              resPostDTOArray.push(respPostDTO);
            });
            resolve(resPostDTOArray);
            return;
          } else {
            resolve(resPostDTOArray);
          }
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resPostDTOArray);
          return;
        });
      });
  };

  findForUserNFriends = (
    userId: string,
    offSetDays: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resPostDTOArray: PostDTO[] = [];
      const fromDate = CommonFn.dateDeduct(
        new Date(),
        DateAddIntervalEnum.DAY,
        parseInt(offSetDays)
      );
      this.friends.findByUserId(userId).then((friends: any[]) => {
        let sql =
          SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
        sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
        sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
        sql +=
          SqlStr.format('last_update_usec >= ?', [fromDate?.valueOf()]) + ' AND ';
        sql += 'user_id IN (';
        sql += SqlStr.format('UUID_TO_BIN(?)', [userId]);
        friends.forEach((friend) => {
          sql += ', ';
          sql += SqlStr.format('UUID_TO_BIN(?)', [friend.friend_id]);
        });
        sql += ')';
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
                let respPostDTO = new this.responseDTO(data) as PostDTO;
                respPostDTO = DTOGenerator.defineProperty(
                  respPostDTO,
                  'comments',
                  []
                );
                resPostDTOArray.push(respPostDTO);
              });
              resolve(resPostDTOArray);
              return;
            } else {
              resolve(resPostDTOArray);
            }
          })
          .catch((err) => {
            SysLog.error(JSON.stringify(err));
            resolve(resPostDTOArray);
            return;
          });
        });

      });
  };

}

import CommonFn, { DateAddIntervalEnum } from './../../modules/CommonFnModule';
import { FriendModel } from './friend.model';
import { SqlFormatter } from '../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { posts_schema, posts_schema_table } from '../../schemas/posts.schema';
import { PostDTO } from '../../dtos/posts.DTO';
import { EntityModel } from './entity.model';
import dbConnection from '../../modules/DbModule';
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
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      const fromDate = CommonFn.dateDeduct(new Date(), DateAddIntervalEnum.DAY, parseInt(offSetDays));
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('user_id = UUID_TO_BIN(?)', [userId]) + ' AND ';
      sql += SqlStr.format('lastUpdateUsec >= ?', [fromDate?.valueOf()]);
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          const resPostDTOArray: PostDTO[] = [];
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respPostDTO = new this.responseDTO(data) as PostDTO;
              resPostDTOArray.push(respPostDTO.data);
            });
            resolve(resPostDTOArray);
            return;
          }
          // not found Customer with the id
          resolve(resPostDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };

  findForUserNFriends = (
    userId: string,
    offSetDays: string
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      const fromDate = CommonFn.dateDeduct(new Date(), DateAddIntervalEnum.DAY, parseInt(offSetDays));
      this.friends.findByUserId(userId).then((friends: any[]) => {
        let sql =
          SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
        sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
        sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
        sql += SqlStr.format('lastUpdateUsec >= ?', [fromDate?.valueOf()]) + ' AND ';
        sql += 'user_id IN (';
        sql += SqlStr.format('UUID_TO_BIN(?)', [userId]);
        friends.forEach((friend) => {
            sql += ', ';
            sql += SqlStr.format('UUID_TO_BIN(?)', [friend.friend_id]);
        });
        sql += ')';
        SysLog.info('findById SQL: ' + sql);
        dbConnection.DB.sql(sql)
          .execute()
          .then((result) => {
            const resPostDTOArray: PostDTO[] = [];
            if (result.rows.length) {
              result.rows.forEach((rowData) => {
                const data = SqlFormatter.transposeResultSet(
                  this.schema,
                  undefined,
                  undefined,
                  rowData
                );
                const respPostDTO = new this.responseDTO(data) as PostDTO;
                respPostDTO.data = DTOGenerator.defineProperty(respPostDTO.data, 'comments', []);
                resPostDTOArray.push(respPostDTO.data);
              });
              resolve(resPostDTOArray);
              return;
            }
            // not found Customer with the id
            resolve(resPostDTOArray);
          })
          .catch((err) => {
            SysLog.error(JSON.stringify(err));
            resolve(undefined);
            return;
          });
      });
    });
  };

  incrementLikesById = async (postId: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = '';
      sql = 'UPDATE ' + SqlStr.escape(this.tableName);
      sql =
        ' SET ' +
        SqlStr.escape('likes') +
        ' = ' +
        SqlStr.escape('likes') +
        ' + 1 ';
      sql += SqlFormatter.formatWhereAND('', { id: postId }, this.tableName, this.schema);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          SysLog.info('updated post likes: ', { id: postId });
          this.findById(postId).then((respPostDTO) => {
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
  incrementShareById = async (postId: string): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql = '';
      sql = 'UPDATE ' + SqlStr.escape(this.tableName);
      sql =
        ' SET ' +
        SqlStr.escape('share') +
        ' = ' +
        SqlStr.escape('share') +
        ' + 1 ';
      sql += SqlFormatter.formatWhereAND('', { id: postId }, this.tableName, this.schema);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          SysLog.info('updated post share: ', { id: postId });
          this.findById(postId).then((respPostDTO) => {
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

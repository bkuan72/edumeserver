import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  postMedias_schema,
  postMedias_schema_table
} from '../../schemas/postMedias.schema';
import { PostMediaDTO } from '../../dtos/postMedias.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import appDbConnection from '../../modules/AppDBModule';

export class PostMediaModel extends EntityModel {
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = postMedias_schema_table;
    }
    this.requestDTO = PostMediaDTO;
    this.responseDTO = PostMediaDTO;
    this.schema = postMedias_schema;
  }

  findByPostId = (
    postId: string
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resPostDTOArray: PostMediaDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('post_id = UUID_TO_BIN(?)', [postId]) ;
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
              const respPostDTO = new this.responseDTO(data) as PostMediaDTO;
              resPostDTOArray.push(respPostDTO);
            });
            resolve(resPostDTOArray);
            return;
          }

          resolve(resPostDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resPostDTOArray);
          return;
        });
      });
  };
}

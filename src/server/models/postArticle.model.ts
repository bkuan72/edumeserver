import { SqlFormatter } from './../../modules/sql.strings';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  postArticles_schema,
  postArticles_schema_table
} from '../../schemas/postArticles.schema';
import { PostArticleDTO } from '../../dtos/postArticles.DTO';
import { EntityModel } from './entity.model';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';
import dbConnection from '../../modules/DbModule';
import DTOGenerator from '../../modules/ModelGenerator';

export class PostArticleModel extends EntityModel {
  constructor(altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else {
      this.tableName = postArticles_schema_table;
    }
    this.requestDTO = PostArticleDTO;
    this.responseDTO = PostArticleDTO;
    this.schema = postArticles_schema;
  }

  findByPostId = (
    postId: string
  ): Promise<any | undefined> => {
    return new Promise((resolve) => {
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('post_id = UUID_TO_BIN(?)', [postId]) ;
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
        .execute()
        .then((result) => {
          const resPostArticleDTOArray: PostArticleDTO[] = [];
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              const respPostArticleDTO = new this.responseDTO(data) as PostArticleDTO;
              respPostArticleDTO.data = DTOGenerator.defineProperty(respPostArticleDTO.data, 'medias', [{
                                                                    type: respPostArticleDTO.data.type,
                                                                    preview: respPostArticleDTO.data.preview

                                                                }]);
              resPostArticleDTOArray.push(respPostArticleDTO.data);
            });
            resolve(resPostArticleDTOArray);
            return;
          }

          resolve(resPostArticleDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(undefined);
          return;
        });
    });
  };
}

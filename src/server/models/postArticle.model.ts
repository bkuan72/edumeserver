import { PostArticleData } from './../../schemas/postArticles.schema';
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
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      const resPostArticleDTOArray: PostArticleDTO[] = [];
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('post_id = UUID_TO_BIN(?)', [postId]) ;
      SysLog.info('findById SQL: ' + sql);
      dbConnection.DB.sql(sql)
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
              let respPostArticleDTO = new this.responseDTO(data) as PostArticleDTO | PostArticleData;
              respPostArticleDTO = DTOGenerator.defineProperty(respPostArticleDTO, 'medias', [{
                                                                    type: respPostArticleDTO.type,
                                                                    preview: respPostArticleDTO.preview

                                                                }]);
              resPostArticleDTOArray.push(respPostArticleDTO);
            });
            resolve(resPostArticleDTOArray);
            return;
          }

          resolve(resPostArticleDTOArray);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resPostArticleDTOArray);
          return;
        });
    });
  };
}

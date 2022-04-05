/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AdKeywordDTO } from '../../dtos/adKeywords.DTO';
import appDbConnection from '../../modules/AppDBModule';
import SqlFormatter from '../../modules/sql.strings';
import SysLog from '../../modules/SysLog';
import { adKeywords_schema, adKeywords_schema_table } from '../../schemas/adKeywords.schema';
import { EntityModel } from './entity.model';

export class AdKeywordModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = adKeywords_schema_table;
    }
    this.requestDTO = AdKeywordDTO;
    this.responseDTO = AdKeywordDTO;
    this.schema = adKeywords_schema;
  }

  getCodesOnly = (): Promise<any[]> => {
    return new Promise ((resolve) => {
      const adAgeGroupsList:string[] = [];
      let sql = 'SELECT adKeyword_code FROM ' + this.tableName;
      sql += SqlFormatter.formatWhereAND('', {site_code: this.siteCode}, this.tableName, this.schema);
      appDbConnection.select(sql)
      .then((result) => {

        if (result.rows.length) {
          result.rows.forEach((rowData: any) => {
            adAgeGroupsList.push(rowData[0]);
          });
          resolve (adAgeGroupsList);
          return;
        }
        // not found
        resolve(adAgeGroupsList);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(adAgeGroupsList);
        return;
      });
      });
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AdCategoryDTO } from '../../dtos/adCategories.DTO';
import appDbConnection from '../../modules/AppDBModule';
import SqlFormatter from '../../modules/sql.strings';
import SysLog from '../../modules/SysLog';
import { adCategories_schema, adCategories_schema_table } from '../../schemas/adCategories.schema';
import { EntityModel } from './entity.model';

export class AdCategoryModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = adCategories_schema_table;
    }
    this.requestDTO = AdCategoryDTO;
    this.responseDTO = AdCategoryDTO;
    this.schema = adCategories_schema;
  }

  
  getCodesOnly = (): Promise<any[]> => {
    return new Promise ((resolve) => {
      const adAgeGroupsList:string[] = [];
      let sql = 'SELECT adCategory_code FROM ' + this.tableName;
      sql += SqlFormatter.formatWhereAND('', {site_code: this.siteCode}, this.tableName, this.schema);
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql).execute()
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

    });
  }
}
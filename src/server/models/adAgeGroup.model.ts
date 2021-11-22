/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AdAgeGroupDTO } from '../../dtos/adAgeGroups.DTO';
import appDbConnection from '../../modules/AppDBModule';
import SqlFormatter from '../../modules/sql.strings';
import SysLog from '../../modules/SysLog';
import { adAgeGroups_schema, adAgeGroups_schema_table } from '../../schemas/adAgeGroups.schema';
import { EntityModel } from './entity.model';

export class AdAgeGroupModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = adAgeGroups_schema_table;
    }
    this.requestDTO = AdAgeGroupDTO;
    this.responseDTO = AdAgeGroupDTO;
    this.schema = adAgeGroups_schema;
  }
  getCodesOnly = (): Promise<any[]> => {
    return new Promise ((resolve) => {
      const adAgeGroupsList:string[] = [];
      let sql = 'SELECT adAgeGroup_code FROM ' + this.tableName;
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
  };
}
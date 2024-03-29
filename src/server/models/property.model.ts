/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { properties_schema, properties_schema_table } from '../../schemas/properties.schema';
import { PropertyDTO } from '../../dtos/properties.DTO';
import { EntityModel } from './entity.model';
import appDbConnection from '../../modules/AppDBModule';
import SysEnv from '../../modules/SysEnv';
import SqlStr = require('sqlstring');
import SysLog from '../../modules/SysLog';

export class PropertyModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = properties_schema_table;
    }
    this.requestDTO = PropertyDTO;
    this.responseDTO = PropertyDTO;
    this.schema = properties_schema;
  }

  getNextNumber(propName: string): Promise<any | string> {
    return new Promise((resolve, reject) => {
      const sitePropName = SysEnv.SITE_CODE+'.'+propName;

      appDbConnection.getNewDbSession().then((DBSession) => {
        DBSession.sql('BEGIN; ').execute()
        .then((result0) => {
          DBSession.sql('SELECT numValue + 1 INTO @nextNumber FROM '+ this.tableName
          + ' WHERE name = ' + SqlStr.escape(sitePropName) + ' AND '
          + ' site_code = ' + SqlStr.escape(SysEnv.SITE_CODE)
          + ' FOR UPDATE;').execute()
          .then((result1) => {
            DBSession.sql('UPDATE '+ this.tableName + ' SET numValue = @nextNumber'
            + ' WHERE name = ' + SqlStr.escape(sitePropName) + ' AND '
            + ' site_code = ' + SqlStr.escape(SysEnv.SITE_CODE) + ';'
            ).execute()
            .then((result2) => {
              DBSession.sql('SELECT @nextNumber;').execute()
              .then((result3) => {
                DBSession.sql('COMMIT; ').execute()
                .then((result4) => {
                SysLog.info(sitePropName +' Next Number: ', result3);
                const nextNumber: any = { 'nextNumber': result3.rows[0][0] }; // TODO
                DBSession.getXSession().close();
                resolve(nextNumber);
                }).catch(() => reject('Error Getting Next Number'));
              }).catch(() => reject('Error Getting Next Number'));
            }).catch(() => reject('Error Getting Next Number'));
          }).catch(() => reject('Error Getting Next Number'));
        })
        .catch(() => {
          DBSession.getXSession().close();
          reject ('Error Getting Next Number');
        })
      }).catch(() => reject('Cannot Get SQL session'));

    });
  }
}

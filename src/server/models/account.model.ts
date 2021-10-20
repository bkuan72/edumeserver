/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { accounts_schema, accounts_schema_table } from '../../schemas/accounts.schema';
import { AccountDTO } from '../../dtos/accounts.DTO';
import { EntityModel } from './entity.model';
import SqlFormatter from '../../modules/sql.strings';
import dbConnection from '../../modules/DbModule';
import { uuidIfc } from '../../interfaces/uuidIfc';
import SysLog from '../../modules/SysLog';
import { PropertyModel } from './property.model';

export class AccountModel extends EntityModel {
  properties: PropertyModel;
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = accounts_schema_table;
    }
    this.requestDTO = AccountDTO;
    this.responseDTO = AccountDTO;
    this.schema = accounts_schema;
    this.properties = new PropertyModel();
  }


  createAccount = (accountType: string, dataInEntity: any): Promise<any> => {
    return new Promise((resolve) => {

      this.properties.getNextNumber('nextAccountNumber').then((property) => {
        const newEntity = new this.requestDTO(dataInEntity);
        newEntity.site_code = this.siteCode;
        newEntity.account_type = accountType;
        newEntity.account_code = property.nextNumber.toString();
        SqlFormatter.formatInsert(
          newEntity,
          this.tableName,
          this.schema
        ).then((sql) => {
          dbConnection.DB.sql('SET @uuidId=UUID(); ').execute()
          .then((result) => {
            dbConnection.DB.sql(sql).execute()
            .then((result2) => {
              dbConnection.DB.sql('SELECT @uuidId;').execute()
              .then((result3) => {
                SysLog.info('created Entity: ', result3);
                const newUuid: uuidIfc = { '@uuidId': result3.rows[0][0] }; // TODO
                newEntity.id = newUuid['@uuidId'];
                resolve(newEntity);
              })
              .catch((err) => {
                SysLog.error(JSON.stringify(err));
                resolve(undefined);
                return;
              });
            })
            .catch((err) => {
              SysLog.error(JSON.stringify(err));
              resolve(undefined);
              return;
            });
          })
          .catch((err) => {
            SysLog.error(JSON.stringify(err));
            const respEntityDTO = new this.responseDTO(newEntity);
            resolve(respEntityDTO);
            return;
          });
        });
      }).catch((err)=>{
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    });
  };

  createDevAccount(dataInEntity: any): Promise<any> {
    return this.createAccount('DEV', dataInEntity);
  }
  createAdminAccount(dataInEntity: any): Promise<any> {
    return this.createAccount('ADMIN', dataInEntity);
  }
  createNormalAccount(dataInEntity: any): Promise<any> {
    return this.createAccount('NORMAL', dataInEntity);
  }
  createServiceAccount(dataInEntity: any): Promise<any> {
    return this.createAccount('SERVICE', dataInEntity);
  }
}

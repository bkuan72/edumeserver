/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { accounts_schema, accounts_schema_table } from '../../schemas/accounts.schema';
import { AccountDTO } from '../../dtos/accounts.DTO';
import { EntityModel } from './entity.model';
import SqlFormatter from '../../modules/sql.strings';
import appDbConnection from '../../modules/AppDBModule';
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
        SqlFormatter.formatInsert(
          [{ fieldName: 'site_code', value: this.siteCode },
           { fieldName: 'account_type', value: accountType }, 
           { fieldName: 'account_code', value: property.nextNumber.toString()},
           { fieldName: 'created_by', value: dataInEntity._req_action_user_}],
          newEntity,
          this.tableName,
          this.schema
        ).then((sql) => {
          appDbConnection.insert(sql).then((newId) => {
            newEntity.id = newId;
          })
          .catch((err) => {
            resolve(undefined);
            return;
          });

        });
      }).catch((err)=>{
        SysLog.error(JSON.stringify(err));
        resolve(undefined);
        return;
      });
    })
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

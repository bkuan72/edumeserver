/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { accounts_schema, accounts_schema_table } from '../../schemas/accounts.schema';
import { AccountDTO } from '../../dtos/accounts.DTO';
import { EntityModel } from './entity.model';

export class AccountModel extends EntityModel {
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
  }
}

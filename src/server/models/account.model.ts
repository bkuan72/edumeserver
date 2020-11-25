/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SqlFormatter } from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import e = require('express');
import dbConnection from '../../modules/DbModule';
import { accounts_schema, accounts_schema_table } from '../../schemas/accounts.schema';
import { AccountDTO } from '../../dtos/accounts.DTO';
import { uuidIfc } from './uuidIfc';
import { EntityModel } from './entity.model';

export class AccountModel extends EntityModel {
  constructor (altTable?: string) {
    if (altTable) {
      super(altTable);
    } else  {
      super();
      this.tableName = accounts_schema_table;
    }
    this.schema = accounts_schema;
    this.requestDTO = AccountDTO;
    this.responseDTO = AccountDTO;
  }


}

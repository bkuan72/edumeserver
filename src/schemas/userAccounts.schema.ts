import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const userAccounts_schema_table = 'user_accounts';

export const userAccounts_schema: schemaIfc[] = [
  {    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {    fieldName: 'site_code',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    default: '',
    excludeFromUpdate: true,
    trim: true
  },
  {    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {    fieldName: 'account_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {    fieldName: 'acc_type',
    sqlType: 'ENUM',
    size: 10,
    enum: ['HOLDER',
        'SUB_USER'
        ],
    default: 'HOLDER'
  },
  {    fieldName: 'allow_notification',
    sqlType: 'TINYINT(1)',
    default: '0'
  },
  {    fieldName: 'allow_promo',
    sqlType: 'TINYINT(1)',
    default: '0'
  },
  {    fieldName: 'test',
    sqlType: 'TINYINT(1)',
    default: '0'
  },
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK',
        'DELETED'
        ],
    default: 'OK'
  },
  {    fieldName: 'lastUpdateUsec',
  sqlType: 'BIGINT',
  default: '0',
  excludeFromUpdate: true
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'user_id_idx',
        columns: ['site_code', 'user_id'],
        unique: true
      },
      {
        name: 'last_upd_usec_idx',
        columns: [ 'site_code', 'lastUpdatedUsec'],
        unique: false
      }
    ],
    enum:[]
  }
];


export enum UserAccountTypeEnum {
    'HOLDER',
    'SUB_USER'
  }

export enum UserAccountStatus {
    'OK',
    'DELETED'
}

const UserAccountsSchemaModel = DTOGenerator.genSchemaModel(userAccounts_schema);
export type UserAccountsData = typeof UserAccountsSchemaModel;
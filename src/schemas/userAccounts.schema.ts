import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const userAccounts_schema_table = 'user_accounts';

export const userAccounts_schema: schemaIfc[] = [
  {    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'unique record identifier'
  },
  {    fieldName: 'site_code',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    default: '',
    excludeFromUpdate: true,
    trim: true,
    description: 'website identifier'
  },
  {    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to users table'
  },
  {    fieldName: 'account_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to accounts table'
  },
  {    fieldName: 'acc_type',
    sqlType: 'ENUM',
    size: 10,
    enum: ['HOLDER',
        'SUB_USER'
        ],
    default: 'HOLDER',
    description: 'account type - holder or sub user'
  },
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK',
        'DELETED'
        ],
    default: 'OK',
    description: 'record status'
  },
  {    fieldName: 'lastUpdateUsec',
  sqlType: 'BIGINT',
  default: '0',
  excludeFromUpdate: true,
  description: 'last update timestamp'
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'user_account_id_idx',
        columns: ['site_code', 'user_id', 'account_id'],
        unique: true
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
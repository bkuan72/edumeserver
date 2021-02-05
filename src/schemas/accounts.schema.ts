import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const accounts_schema_table = 'accounts';

export const accounts_schema: schemaIfc[] = [
  {    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'record unique identifier'
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
  {    fieldName: 'account_type',
    sqlType: 'ENUM',
    size: 10,
    enum: ['SERVICE', 'NORMAL', 'ADMIN', 'DEV'],
    default: 'NORMAL',
    excludeFromUpdate: true,
    description: 'account role type'
  },
  {    fieldName: 'account_code',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    default: '',
    trim: true,
    description: 'account code'
  },
  {    fieldName: 'description',
    sqlType: 'VARCHAR(50)',
    size: 50,
    allowNull: false,
    default: '',
    trim: true,
    description: 'account description'
  },
  {    fieldName: 'website',
    sqlType: 'VARCHAR(120)',
    size: 120,
    allowNull: false,
    default: '',
    trim: true,
    description: 'account external website URL'
  },
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['PENDING', 'APPROVED', 'SUSPENDED', 'DELETED'],
    default: 'PENDING',
    description: 'account status'
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
        name: 'account_code_idx',
        columns: ['site_code', 'account_code'],
        unique: true
      },
      {
        name: 'last_upd_usec_idx',
        columns: [ 'site_code', 'lastUpdateUsec'],
        unique: false
      }
    ],
    enum: []
  }
];

export enum AccountTypeEnum {
  'SERVICE',
  'NORMAL',
  'ADMIN',
  'DEV'
}

export enum AccountStatusEnum {
  'PENDING',
  'APPROVED',
  'SUSPENDED',
  'DELETED'
}

const AccountSchemaModel = DTOGenerator.genSchemaModel(accounts_schema);
export type AccountData = typeof AccountSchemaModel;

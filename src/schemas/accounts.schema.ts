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
    enum: [],
    index: []
  },
  {    fieldName: 'site_code',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    default: '',
    excludeFromUpdate: true,
    trim: true,
    enum: [],
    index: []
  },
  {    fieldName: 'account_type',
    sqlType: 'ENUM',
    size: 10,
    enum: ['SERVICE', 'NORMAL', 'ADMIN'],
    index: [],
    default: 'NORMAL'
  },
  {    fieldName: 'account_code',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    default: '',
    trim: true,
    enum: [],
    index: []
  },
  {    fieldName: 'description',
    sqlType: 'VARCHAR(50)',
    size: 50,
    allowNull: false,
    default: '',
    trim: true,
    enum: [],
    index: []
  },
  {    fieldName: 'website',
    sqlType: 'VARCHAR(120)',
    size: 120,
    allowNull: false,
    default: '',
    trim: true,
    enum: [],
    index: []
  },
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['PENDING', 'APPROVED', 'SUSPENDED', 'DELETED'],
    index: [],
    default: 'PENDING'
  },
  {    fieldName: 'lastUpdateUsec',
  sqlType: 'BIGINT',
  default: '0',
  excludeFromUpdate: true,
  enum: [],
  index: []
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
        columns: [ 'site_code', 'lastUpdatedUsec'],
        unique: false
      }
    ],
    enum: []
  }
];

export enum AccountTypeEnum {
  'SERVICE',
  'NORMAL',
  'ADMIN'
}

export enum AccountStatusEnum {
  'PENDING',
  'APPROVED',
  'SUSPENDED',
  'DELETED'
}

const AccountSchemaModel = DTOGenerator.genSchemaModel(accounts_schema);
export type AccountData = typeof AccountSchemaModel;

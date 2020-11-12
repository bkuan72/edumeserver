import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const userAccounts_schema: schemaIfc[] = [
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
  {    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    enum: [],
    index: []
  },
  {    fieldName: 'account_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    enum: [],
    index: []
  },
  {    fieldName: 'acc_type',
    sqlType: 'ENUM',
    size: 10,
    enum: ['HOLDER',
        'SUB_USER'
        ],
    index: [],
    default: 'HOLDER'
  },
  {    fieldName: 'allow_notification',
    sqlType: 'TINYINT(1)',
    enum: [],
    index: [],
    default: '0'
  },
  {    fieldName: 'allow_promo',
    sqlType: 'TINYINT(1)',
    enum: [],
    index: [],
    default: '0'
  },
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK',
        'DELETED'
        ],
    index: [],
    default: 'OK'
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'user_id_idx',
        columns: ['site_code', 'user_id'],
        unique: true
      },
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
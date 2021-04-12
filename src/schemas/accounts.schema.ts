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
  {    fieldName: 'account_name',
    sqlType: 'VARCHAR(100)',
    size: 100,
    allowNull: true,
    default: '',
    trim: true,
    description: 'Account Name'
  },
  {    fieldName: 'description',
    sqlType: 'VARCHAR(255)',
    size: 50,
    allowNull: false,
    default: '',
    trim: true,
    description: 'account description'
  },
  {
    fieldName: 'about_me',
    sqlType: 'TEXT',
    default: ''
  },
  {
    fieldName: 'email',
    sqlType: 'VARCHAR(100)',
    size: 100,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    description: 'user email address'
  },
  {
    fieldName: 'phone_no',
    sqlType: 'VARCHAR(30)',
    size: 30,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    description: 'land line phone number'
  },
  {
    fieldName: 'mobile_no',
    sqlType: 'VARCHAR(30)',
    size: 30,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    description: 'mobile number'
  },
  {    fieldName: 'website',
    sqlType: 'VARCHAR(255)',
    size: 120,
    allowNull: false,
    default: '',
    trim: true,
    description: 'account external website URL'
  },
  { fieldName: 'avatar',
    sqlType: 'TEXT',
    trim: true,
    default: '',
    description: 'user`s avatar blob - type png'
   },
  {
    fieldName: 'language',
    sqlType: 'VARCHAR(2)',
    size: 2,
    allowNull: false,
    excludeFromUpdate: false,
    default: 'EN',
    trim: true,
    description: 'language code'
  },
  {    fieldName: 'ageGroups',
    sqlType: 'TEXT',
    default: '',
    description: 'a comma delimited string of ageGroups use for filtering'
  },
  {
    fieldName: 'categories',
    sqlType: 'TEXT',
    default: '',
    excludeFromUpdate: false,
    trim: true,
    description: 'a comma delimited string of categories use for filtering'
  },
  {    fieldName: 'keywords',
    sqlType: 'TEXT',
    allowNull: false,
    default: '',
    excludeFromUpdate: false,
    trim: true,
    description: 'a comma delimited string of keywords use for filtering'
  },
  {
    fieldName: 'address',
    sqlType: 'TEXT',
    size: 255,
    allowNull: true,
    default: '',
    description: 'Address for advertisement'
  },
  {
    fieldName: 'suburb',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: true,
    default: '',
    trim: true,
    description: 'Suburb'
  },
  {
    fieldName: 'city',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: true,
    default: '',
    trim: true,
    description: 'City'
  },
  {
    fieldName: 'state',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: true,
    default: '',
    trim: true,
    description: 'State'
  },
  {
    fieldName: 'country',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: true,
    default: '',
    trim: true,
    description: 'Country'
  },
  {
    fieldName: 'post_code',
    sqlType: 'VARCHAR(10)',
    size: 10,
    allowNull: true,
    default: '',
    trim: true,
    description: 'Post Code'
  },
  {
    fieldName: 'allow_notification',
    sqlType: 'BOOLEAN',
    default: '1',
    description: 'allow application notification'
  },
  {
    fieldName: 'allow_promo',
    sqlType: 'BOOLEAN',
    default: '1',
    description: 'allow promotional emails'
  },
  {
    fieldName: 'allow_msg',
    sqlType: 'BOOLEAN',
    default: '1',
    description: 'allow messaging'
  },
  {
    fieldName: 'allow_friends',
    sqlType: 'BOOLEAN',
    default: '1',
    description: 'allow friending'
  },
  {
    fieldName: 'allow_follows',
    sqlType: 'BOOLEAN',
    default: '1',
    description: 'allow followings'
  },
  {
    fieldName: 'public',
    sqlType: 'BOOLEAN',
    default: '1',
    description: 'allow user profile data to be shown'
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

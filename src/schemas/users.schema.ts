import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const users_schema_table = 'users';

export const users_schema: schemaIfc[] = [
  {
    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {
    fieldName: 'site_code',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    default: '',
    excludeFromUpdate: true,
    trim: true
  },
  {
    fieldName: 'title',
    sqlType: 'ENUM',
    size: 10,
    enum: ['Mr', 'Ms', 'Mrs', 'Dr', 'Madam', 'Sir', 'N/A'],
    excludeFromUpdate: false,
    default: 'N/A'
  },
  {
    fieldName: 'user_name',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: false,
    excludeFromUpdate: false,
    default: ''
  },
  {
    fieldName: 'first_name',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: false,
    excludeFromUpdate: false,
    default: ''
  },
  {
    fieldName: 'last_name',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: false,
    excludeFromUpdate: false,
    default: ''
  },
  {
    fieldName: 'password',
    sqlType: 'VARCHAR(256)',
    size: 20,
    allowNull: false,
    default: '',
    trim: true,
    encrypt: true,
    bcryptIt: true,
    excludeFromSelect: true
  },
  {
    fieldName: 'email',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'phone_no',
    sqlType: 'VARCHAR(30)',
    size: 30,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'mobile_no',
    sqlType: 'VARCHAR(30)',
    size: 30,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'website',
    sqlType: 'VARCHAR(255)',
    size: 255,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  { fieldName: 'avatar', 
    sqlType: 'TEXT', 
    trim: true,
    default: ''
   },
  {
    fieldName: 'language',
    sqlType: 'VARCHAR(2)',
    size: 2,
    allowNull: false,
    excludeFromUpdate: false,
    default: 'EN',
    trim: true
  },
  {
    fieldName: 'address',
    sqlType: 'VARCHAR(255)',
    size: 255,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'suburb',
    sqlType: 'VARCHAR(255)',
    size: 255,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'city',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'state',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'country',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'gender',
    sqlType: 'VARCHAR(10)',
    size: 10,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'birthday',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'post_code',
    sqlType: 'VARCHAR(10)',
    size: 10,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'about_me',
    sqlType: 'TEXT',
    default: ''
  },
  {
    fieldName: 'occupation',
    sqlType: 'TEXT',
    default: ''
  },
  {
    fieldName: 'skills',
    sqlType: 'TEXT',
    default: ''
  },
  {
    fieldName: 'jobs',
    sqlType: 'TEXT',
    default: ''
  },
  {
    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['ENABLED', 'DISABLED', 'BLOCKED', 'RETRY_LOCKED_OUT'],
    excludeFromUpdate: false,
    default: 'ENABLED'
  },
  { fieldName: 'reg_confirm_key', sqlType: 'VARCHAR(60)', size: 60 },
  { fieldName: 'pwd_reset_key', sqlType: 'VARCHAR(60)', size: 60 },
  {
    fieldName: 'lastUpdateUsec',
    sqlType: 'BIGINT',
    default: '0',
    excludeFromUpdate: true
  },
  {
    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'email_idx',
        columns: ['site_code', 'email'],
        unique: true
      },
      {
        name: 'phone_idx',
        columns: ['site_code', 'phone_no'],
        unique: false
      },
      {
        name: 'last_upd_usec_idx',
        columns: ['site_code', 'lastUpdateUsec'],
        unique: false
      }
    ]
  }
];

export enum UserStatusEnum {
  'ENABLED',
  'DISABLED',
  'BLOCKED',
  'RETRY_LOCKED_OUT'
}

export enum UserTitleEnum {
  'Mr',
  'Ms',
  'Mrs',
  'Dr',
  'Madam',
  'Sir'
}
const UserSchemaModel = DTOGenerator.genSchemaModel(users_schema);
export type UserData = typeof UserSchemaModel;

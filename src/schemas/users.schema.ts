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
    excludeFromUpdate: true,
    description: 'unique record identifier'
  },
  {
    fieldName: 'site_code',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    default: '',
    excludeFromUpdate: true,
    trim: true,
    description: 'website reference code'
  },
  {
    fieldName: 'title',
    sqlType: 'ENUM',
    size: 10,
    enum: ['Mr', 'Ms', 'Mrs', 'Dr', 'Madam', 'Sir', 'N/A'],
    excludeFromUpdate: false,
    default: 'N/A',
    description: 'User preferred title'
  },
  {
    fieldName: 'user_name',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    description: 'user name shown on avatar'
  },
  {
    fieldName: 'first_name',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    description: 'first name'
  },
  {
    fieldName: 'last_name',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    description: 'last name'
  },
  {
    fieldName: 'company',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    description: 'company name'
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
    excludeFromSelect: true,
    description: 'password'
  },
  {
    fieldName: 'email',
    sqlType: 'VARCHAR(60)',
    size: 60,
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
  {
    fieldName: 'website',
    sqlType: 'VARCHAR(255)',
    size: 255,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    description: 'user`s own website'
  },
  {
    fieldName: 'avatar',
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
  {
    fieldName: 'address',
    sqlType: 'VARCHAR(255)',
    size: 255,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    description: 'user`s address'
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
  {
    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['ENABLED', 'DISABLED', 'BLOCKED', 'RETRY_LOCKED_OUT'],
    excludeFromUpdate: false,
    default: 'ENABLED'
  },
  {
    fieldName: 'reg_confirm_key',
    sqlType: 'VARCHAR(60)',
    size: 60,
    description: 'code used in confirming new user registration'
  },
  {
    fieldName: 'pwd_reset_key',
    sqlType: 'VARCHAR(60)',
    size: 60,
    description: 'keys set for password reset'
  },
  {
    fieldName: 'lastUpdateUsec',
    sqlType: 'BIGINT',
    default: '0',
    excludeFromUpdate: true,
    description: 'last update timestamp'
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

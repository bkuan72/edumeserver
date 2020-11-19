import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const users_schema: schemaIfc[] = [
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
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    enum: [],
    index: []
  },
  {    fieldName: 'title',
    sqlType: 'ENUM',
    size: 10,
    enum: ['Mr', 'Ms', 'Mrs', 'Dr', 'Madam', 'Sir'],
    excludeFromUpdate: false,
    index: [],
    default: 'Mr'
  },
  {    fieldName: 'user_name',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    enum: [],
    index: []
  },
  {    fieldName: 'password',
    sqlType: 'VARCHAR(256)',
    size: 20,
    allowNull: false,
    default: '',
    trim: true,
    enum: [],
    index: [],
    encrypt: true,
    bcryptIt: true,
    excludeFromSelect: true
  },
  {    fieldName: 'email',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    enum: [],
    index: []
  },
  {    fieldName: 'phone_no',
    sqlType: 'VARCHAR(30)',
    size: 30,
    allowNull: false,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    enum: [],
    index: []
  },
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['ENABLED',
      'DISABLED',
      'BLOCKED',
      'RETRY_LOCKED_OUT'
      ],
    excludeFromUpdate: false,
    index: [],
    default: 'ENABLED'
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
        name: 'email_idx',
        columns: ['site_code', 'email'],
        unique: true
      },
      {
        name: 'phone_idx',
        columns: ['site_code', 'phone_no'],
        unique: false
      }
    ],
    enum: []
  }
];

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

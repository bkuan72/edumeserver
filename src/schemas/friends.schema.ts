import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const friends_schema_table = 'friends';

export const friends_schema: schemaIfc[] = [
  {
    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'record unique identifier'
  },
  {
    fieldName: 'site_code',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    default: '',
    excludeFromUpdate: true,
    trim: true,
    description: 'website identifier'
  },
  {
    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK', 'DELETED'],
    default: 'OK',
    description: 'record status'
  },
  {
    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to users - owner'
  },
  {
    fieldName: 'account_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to accounts - account'
  },
  {
    fieldName: 'group_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to groups - group'
  },
  {
    fieldName: 'friend_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to users - friend'
  },
  {
    fieldName: 'friend_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'date friended'
  },
  {
    fieldName: 'friend_group',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: true,
    excludeFromUpdate: false,
    trim: false,
    description: 'date friended'
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
    allowNull: true,
    excludeFromUpdate: false,
    default: '',
    description: 'last name'
  },
  { fieldName: 'avatar',
    sqlType: 'TEXT',
    trim: true,
    default: '',
    description: 'user`s avatar blob - type png'
  },
  {
    fieldName: 'nickname',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: true,
    excludeFromUpdate: false,
    trim: false,
    default: '',
    description: 'friend nickname'
  },
  {
    fieldName: 'email',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: true,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    description: 'user email address'
  },
  {
    fieldName: 'mobile_no',
    sqlType: 'VARCHAR(30)',
    size: 30,
    allowNull: true,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    description: 'land line phone number'
  },
  {
    fieldName: 'company',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: true,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    description: 'company name'
  },
  {
    fieldName: 'job_title',
    sqlType: 'VARCHAR(60)',
    size: 60,
    allowNull: true,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    description: 'Job Title'
  },
  {
    fieldName: 'address',
    sqlType: 'VARCHAR(255)',
    size: 255,
    allowNull: true,
    excludeFromUpdate: false,
    default: '',
    trim: true,
    description: 'user`s address'
  },
  {
    fieldName: 'birthday',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: true,
    excludeFromUpdate: false,
    default: '',
    trim: true
  },
  {
    fieldName: 'notes',
    sqlType: 'TEXT',
    default: ''
  },
  {
    fieldName: 'starred',
    sqlType: 'BOOLEAN',
    default: '0',
    excludeFromUpdate: true,
    description: 'starred friends'
  },
  {
    fieldName: 'frequent',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: true,
    description: 'frequent contacted friends'
  },
  {
    fieldName: 'friend_req_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: true,
    excludeFromUpdate: false,
    trim: false,
    description: 'date friend requested'
  },
  {
    fieldName: 'friend_block_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: true,
    excludeFromUpdate: false,
    trim: false,
    description: 'date friend blocked'
  },
  {
    fieldName: 'friend_status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['BLOCKED', 'REQUEST', 'OK'],
    default: 'REQUEST'
  },
  {
    fieldName: 'last_update_usec',
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
        name: 'user_id_idx',
        columns: ['site_code', 'first_name', 'friend_date'],
        unique: false
      },
      {
        name: 'friend_status_idx',
        columns: ['site_code', 'first_name', 'friend_status', 'last_update_usec'],
        unique: false
      }
    ]
  }
];

const FriendSchemaModel = DTOGenerator.genSchemaModel(friends_schema);
export type FriendData = typeof FriendSchemaModel;

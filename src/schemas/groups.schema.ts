import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const socialGroups_schema_table = 'socialGroups';

export const socialGroups_schema: schemaIfc[] = [
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
    fieldName: 'group_type',
    sqlType: 'ENUM',
    size: 10,
    enum: ['USER', 'ACCOUNT'],
    default: 'USER',
    description: 'group type - by USER or ACCOUNT'
  },
  {
    fieldName: 'owner_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'group type USER - link to users, ACCOUNT - link to accounts'
  },
  {
    fieldName: 'date_create',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'date time group was created'
  },
  {
    fieldName: 'group_name',
    sqlType: 'VARCHAR(50)',
    size: 50,
    allowNull: false,
    default: '',
    excludeFromUpdate: false,
    trim: true,
    description: 'name of group'
  },
  {
    fieldName: 'avatar',
    sqlType: 'TEXT',
    allowNull: true,
    excludeFromUpdate: false,
    trim: true,
    default: '',
    description: 'group avatar image'
  },
  {
    fieldName: 'group_img',
    sqlType: 'MEDIUMBLOB',
    allowNull: true,
    excludeFromUpdate: false,
    trim: true,
    default: '',
    description: 'group image blob'
  },
  { fieldName: 'title',
    sqlType: 'TEXT',
    excludeFromUpdate: false,
    trim: true,
    default: '',
    description: 'group title'
  },
  {
    fieldName: 'excerpt',
    sqlType: 'TEXT',
    excludeFromUpdate: false,
    trim: true,
    default: '',
    description: 'group description'
  },
  {
    fieldName: 'category',
    sqlType: 'VARCHAR(30)',
    size: 30,
    excludeFromUpdate: false,
    trim: true,
    description: 'group category - lookup adCategories'
  },
  {    fieldName: 'keywords',
  sqlType: 'TEXT',
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  description: 'a comma delimited string of keywords use for filtering - lookup adKeywords'
  },
  {    fieldName: 'public',
    sqlType: 'TINYINT(1)',
    default: '1',
    description: 'allow group profile to be discoverable'
  },
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
        name: 'account_group_idx',
        columns: ['site_code', 'group_type', 'owner_id', 'group_name'],
        unique: true
      },
      {
        name: 'last_upd_usec_idx',
        columns: ['site_code','group_type', 'owner_id', 'lastUpdateUsec'],
        unique: false
      }
    ]
  }
];

const GroupSchemaModel = DTOGenerator.genSchemaModel(socialGroups_schema);
export type GroupData = typeof GroupSchemaModel;

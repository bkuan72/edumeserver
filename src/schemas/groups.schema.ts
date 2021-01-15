import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const groups_schema_table = 'accgroups';

export const groups_schema: schemaIfc[] = [
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
    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK', 'DELETED'],
    default: 'OK'
  },
  {
    fieldName: 'account_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {
    fieldName: 'date_create',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false
  },
  {
    fieldName: 'group_name',
    sqlType: 'VARCHAR(50)',
    size: 50,
    allowNull: false,
    default: '',
    excludeFromUpdate: false,
    trim: true
  },
  {
    fieldName: 'avatar',
    sqlType: 'TEXT',
    allowNull: true,
    excludeFromUpdate: false,
    trim: true,
    default: ''
  },
  {
    fieldName: 'preview',
    sqlType: 'VARCHAR(125)',
    size: 125,
    allowNull: true,
    excludeFromUpdate: false,
    trim: true
  },
  { fieldName: 'title',
    sqlType: 'TEXT',
    excludeFromUpdate: false,
    trim: true,
    default: ''
  },
  {
    fieldName: 'excerpt',
    sqlType: 'TEXT',
    excludeFromUpdate: false,
    trim: true,
    default: ''
  },
  {
    fieldName: 'category',
    sqlType: 'VARCHAR(20)',
    size: 20,
    excludeFromUpdate: false,
    trim: true
  },
  {
    fieldName: 'access_type', // Open or Private
    sqlType: 'VARCHAR(10)',
    excludeFromUpdate: false,
    trim: true
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
        columns: ['site_code', 'account_id', 'group_name'],
        unique: true
      },
      {
        name: 'last_upd_usec_idx',
        columns: ['site_code', 'account_id', 'lastUpdatedUsec'],
        unique: false
      }
    ]
  }
];

const GroupSchemaModel = DTOGenerator.genSchemaModel(groups_schema);
export type GroupData = typeof GroupSchemaModel;

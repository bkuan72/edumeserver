import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const userMediaPeriods_schema_table = 'userMediaPeriods';

export const userMediaPeriods_schema: schemaIfc[] = [
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
    fieldName: 'period',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'period eg Month YYYY'
  },
  {
    fieldName: 'info',
    sqlType: 'TEXT',
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'period info'
  },
  {
    fieldName: 'upload_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'date time media uploaded'
  },
  {
    fieldName: 'filename',
    sqlType: 'VARCHAR(132)',
    size: 132,
    allowNull: false,
    default: '',
    excludeFromUpdate: false,
    trim: false,
    description: 'media filename'
  },
  {
    fieldName: 'media_type',
    sqlType: 'VARCHAR(10)',
    size: 10,
    allowNull: false,
    default: '',
    excludeFromUpdate: false,
    trim: true,
    description: 'type of media : image or video'
  },
  {
    fieldName: 'title',
    sqlType: 'TEXT',
    allowNull: true,
    excludeFromUpdate: false,
    trim: true,
    default: ''
  },
  {    fieldName: 'preview',
    sqlType: 'MEDIUMBLOB',
    default: '',
    description: 'image data'
    },
    {    fieldName: 'fullImage',
    sqlType: 'MEDIUMBLOB',
    default: '',
    description: 'full resolution image data',
    excludeFromSelect: true
    },
  {    fieldName: 'embed',
    sqlType: 'TEXT',
    default: '',
    description: 'video url'
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
        columns: ['site_code', 'user_id', 'period', 'last_update_usec'],
        unique: false
      }
    ]
  }
];

const UserMediaPeriodSchemaModel = DTOGenerator.genSchemaModel(userMediaPeriods_schema);
export type UserMediaPeriodData = typeof UserMediaPeriodSchemaModel;

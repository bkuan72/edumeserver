import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const medias_schema_table = 'medias';

export const medias_schema: schemaIfc[] = [
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
    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {
    fieldName: 'upload_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false
  },
  {
    fieldName: 'media_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false
  },
  {
    fieldName: 'media_type',
    sqlType: 'VARCHAR(10)',
    size: 10,
    allowNull: false,
    default: '',
    excludeFromUpdate: false,
    trim: true
  },
  {
    fieldName: 'title',
    sqlType: 'TEXT',
    allowNull: true,
    excludeFromUpdate: false,
    trim: true
  },
  {
    fieldName: 'preview',
    sqlType: 'VARCHAR(125)',
    size: 125,
    allowNull: true,
    excludeFromUpdate: false,
    trim: true
  },
  {
    fieldName: 'embed',
    sqlType: 'VARCHAR(125)',
    size: 125,
    allowNull: true,
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
        name: 'user_id_idx',
        columns: ['site_code', 'user_id', 'media_date'],
        unique: true
      }
    ]
  }
];

const MediaSchemaModel = DTOGenerator.genSchemaModel(medias_schema);
export type MediaData = typeof MediaSchemaModel;

import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const accountGroupTimelineComments_schema_table = 'accountGroup_timeline_comments';

export const accountGroupTimelineComments_schema: schemaIfc[] = [
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
    description: ' status of record'
  },
  {
    fieldName: 'timeline_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    default: '',
    description: 'link to accountGroupTimelines table'
  },
  {
    fieldName: 'post_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    default: '',
    description: 'link to posts table'
  },
  {
    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    default: '',
    description: 'link to users table - comment user'
  },
  {
    fieldName: 'date_comment',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    default: '',
    description: 'date of comment'
  },
  {
    fieldName: 'message',
    sqlType: 'TEXT',
    excludeFromUpdate: false,
    trim: true,
    default: '',
    description: 'comment message'
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
        name: 'timeline_idx',
        columns: ['site_code', 'timeline_id', 'date_comment'],
        unique: false
      }
    ]
  }
];

const AccountGroupTimelineCommentSchemaModel = DTOGenerator.genSchemaModel(accountGroupTimelineComments_schema);
export type AccountGroupTimelineCommentData = typeof AccountGroupTimelineCommentSchemaModel;

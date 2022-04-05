import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const posts_schema_table = 'posts';

export const posts_schema: schemaIfc[] = [
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
    description: 'status of post'
  },
  {
    fieldName: 'post_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    default: '',
    allowNull: false,
    excludeFromUpdate: true,
    trim: false,
    description: 'date time post was uploaded'
  },
  {
    fieldName: 'post_type',
    sqlType: 'VARCHAR(25)',
    size: 25,
    default: "post",
    allowNull: false,
    excludeFromUpdate: true,
    trim: true,
    description: 'post type: post, something, video, article'
  },
  {
    fieldName: 'message',
    sqlType: 'TEXT',
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    default: '',
    description: 'message in post'
  },
  {
    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    default: '',
    excludeFromUpdate: true,
    description: 'link to users table - post user'
  },

  {
    fieldName: 'last_update_usec',
    sqlType: 'BIGINT',
    default: '0',
    excludeFromUpdate: true
  },
  {
    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'last_upd_usec_idx',
        columns: ['site_code', 'user_id', 'last_update_usec'],
        unique: false
      }
    ]
  }
];

const PostSchemaModel = DTOGenerator.genSchemaModel(posts_schema);
export type PostData = typeof PostSchemaModel;

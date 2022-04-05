import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const postArticles_schema_table = 'post_articles';

export const postArticles_schema: schemaIfc[] = [
  {    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'record unique identifier'
  },
  {    fieldName: 'site_code',
  sqlType: 'VARCHAR(20)',
  size: 20,
  allowNull: false,
  default: '',
  excludeFromUpdate: true,
  trim: true,
  description: 'website identifier'
  },
  {
    fieldName: 'title',
    sqlType: 'TEXT',
    allowNull: true,
    excludeFromUpdate: false,
    trim: true,
    description: 'article title'
  },
  {
    fieldName: 'subtitle',
    sqlType: 'TEXT',
    allowNull: true,
    excludeFromUpdate: false,
    trim: true,
    description: 'article sub title'
  },
  {
    fieldName: 'excerpt',
    sqlType: 'TEXT',
    allowNull: true,
    excludeFromUpdate: false,
    trim: true,
    description: 'article excerpt'
  },
  {    fieldName: 'type',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    excludeFromUpdate: false,
    trim: true,
    description: 'article type media type'
  },
  {    fieldName: 'preview',
    sqlType: 'MEDIUMBLOB',
    description: 'article media blob'
    },
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK',
        'DELETED'
        ],
    default: 'OK',
    description: 'record status'
  },
  {    fieldName: 'post_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to posts table'
  },
  {    fieldName: 'last_update_usec',
    sqlType: 'BIGINT',
    default: '0',
    excludeFromUpdate: true,
    description: 'last update timestamp'
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'post_id_idx',
        columns: ['site_code', 'post_id', 'last_update_usec'],
        unique: false
      }
    ]
  }
];

const PostArticleSchemaModel = DTOGenerator.genSchemaModel(postArticles_schema);
export type PostArticleData = typeof PostArticleSchemaModel;
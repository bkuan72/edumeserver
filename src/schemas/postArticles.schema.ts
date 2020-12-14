import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const postArticles_schema_table = 'post_articles';

export const postArticles_schema: schemaIfc[] = [
  {    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {    fieldName: 'site_code',
  sqlType: 'VARCHAR(20)',
  size: 20,
  allowNull: false,
  default: '',
  excludeFromUpdate: true,
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
    fieldName: 'subtitle',
    sqlType: 'TEXT',
    allowNull: true,
    excludeFromUpdate: false,
    trim: true
  },
  {
    fieldName: 'excerpt',
    sqlType: 'TEXT',
    allowNull: true,
    excludeFromUpdate: false,
    trim: true
  },
  {    fieldName: 'type',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    excludeFromUpdate: false,
    trim: true
  },
  {    fieldName: 'preview',
    sqlType: 'VARCHAR(125)',
    size: 125,
    allowNull: false,
    excludeFromUpdate: false,
    trim: true
    },
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK',
        'DELETED'
        ],
    default: 'OK'
  },
  {    fieldName: 'post_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {    fieldName: 'lastUpdateUsec',
    sqlType: 'BIGINT',
    default: '0',
    excludeFromUpdate: true
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'post_id_idx',
        columns: ['site_code', 'post_id'],
        unique: true
      }
    ]
  }
];

const PostArticleSchemaModel = DTOGenerator.genSchemaModel(postArticles_schema);
export type PostArticleData = typeof PostArticleSchemaModel;
import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const postMedias_schema_table = 'post_medias';

export const postMedias_schema: schemaIfc[] = [
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
  {    fieldName: 'type',
    sqlType: 'VARCHAR(6)',
    size: 20,
    default: 'image',
    allowNull: false,
    excludeFromUpdate: false,
    trim: true
  },
  {    fieldName: 'preview',
    sqlType: 'MEDIUMBLOB',
    default: '',
    },
  {    fieldName: 'embed',
    sqlType: 'TEXT',
    default: '',
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
    excludeFromUpdate: true,
    default: '',
  },
  {    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    default: '',
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

const PostMediaSchemaModel = DTOGenerator.genSchemaModel(postMedias_schema);
export type PostMediaData = typeof PostMediaSchemaModel;
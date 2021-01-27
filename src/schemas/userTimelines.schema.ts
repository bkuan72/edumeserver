import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const userTimelines_schema_table = 'user_timelines';

export const userTimelines_schema: schemaIfc[] = [
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
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK',
        'DELETED'
        ],
    default: 'OK'
  },
  {    fieldName: 'timeline_user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    default: ''
  },
  {    fieldName: 'post_user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    default: ''
  },
  {    fieldName: 'post_date',
  sqlType: 'VARCHAR(25)',
  size: 25,
  allowNull: false,
  excludeFromUpdate: false,
  trim: false,
  default: ''
  },
  {    fieldName: 'post_id',
  sqlType: 'BINARY(16)',
  primaryKey: false,
  uuidProperty: true,
  excludeFromUpdate: true,
  default: ''
  },
  {
    fieldName: 'likes',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: true
  },
  {
    fieldName: 'shared',
    sqlType: 'INT',
    default: '0',
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
        name: 'timeline_idx',
        columns: ['site_code', 'timeline_user_id', 'post_date'],
        unique: false
      },
      {
        name: 'last_upd_usec_idx',
        columns: [ 'site_code', 'timeline_user_id', 'lastUpdateUsec'],
        unique: false
      }
    ]
  }
];

const UserTimelineSchemaModel = DTOGenerator.genSchemaModel(userTimelines_schema);
export type UserTimelineData = typeof UserTimelineSchemaModel;
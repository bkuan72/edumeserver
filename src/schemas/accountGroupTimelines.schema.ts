import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const accountGroupTimelines_schema_table = 'accountGroup_timelines';

export const accountGroupTimelines_schema: schemaIfc[] = [
  {    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'unique record identifier'
  },
  {    fieldName: 'site_code',
  sqlType: 'VARCHAR(20)',
  size: 20,
  allowNull: false,
  default: '',
  excludeFromUpdate: true,
  trim: true,
  description: 'web site code'
  },
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK',
        'DELETED'
        ],
    default: 'OK',
    description: 'status of record'
  },
  {    fieldName: 'post_user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    default: '',
    description: 'link to users table - user who post'
  },
  {    fieldName: 'account_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    default: '',
    description: 'link to account table - account timeline'
  },
  {    fieldName: 'group_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    default: '',
    description: 'link to group table - group timeline'
  },
  {    fieldName: 'post_date',
  sqlType: 'VARCHAR(25)',
  size: 25,
  allowNull: false,
  excludeFromUpdate: false,
  trim: false,
  default: '',
  description: 'date of posting on timeline'
  },
  {    fieldName: 'post_id',
  sqlType: 'BINARY(16)',
  primaryKey: false,
  uuidProperty: true,
  excludeFromUpdate: true,
  default: '',
  description: 'link to posts table'
  },
  {
    fieldName: 'likes',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: true,
    description: 'number of likes'
  },
  {
    fieldName: 'shared',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: true,
    description: 'number of shares'
  },
  {    fieldName: 'lastUpdateUsec',
  sqlType: 'BIGINT',
  default: '0',
  excludeFromUpdate: true,
  description: 'last updated timestamp'
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'timeline_idx',
        columns: ['site_code', 'account_id', 'group_id', 'post_date'],
        unique: false
      },
      {
        name: 'last_upd_usec_idx',
        columns: [ 'site_code', 'account_id', 'group_id', 'lastUpdateUsec'],
        unique: false
      }
    ]
  }
];

const AccountGroupTimelineSchemaModel = DTOGenerator.genSchemaModel(accountGroupTimelines_schema);
export type AccountGroupTimelineData = typeof AccountGroupTimelineSchemaModel;
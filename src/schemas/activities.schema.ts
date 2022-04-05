import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const activities_schema_table = 'activities';

export const activities_schema: schemaIfc[] = [
  {
    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'record unique identifier'
  },
  {
    fieldName: 'activity_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: true,
    trim: false,
    description: 'date of activity'
  },
  {
    fieldName: 'message',
    sqlType: 'TEXT',
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    default: '',
    description: 'message'
  },
  {
    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to users table - activity initiator'
  },
  {
    fieldName: 'friends_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to friends table - for friend request'
  },
  {
    fieldName: 'account_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to accounts table - activity initiator'
  },
  {
    fieldName: 'group_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to groups table - activity initiator'
  },
  {
    fieldName: 'member_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to accountGroupMembers table - for member request'
  },
  {
    fieldName: 'timeline_user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to users table - timeline to appear on'
  },
  {
    fieldName: 'timeline_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to userTimelines table'
  },
  {
    fieldName: 'activity_type',
    sqlType: 'ENUM',
    size: 15,
    enum: ['LIKES', 'SHARE', 'MESSAGED', 'FOLLOW_REQUEST', 'FRIEND_REQUEST','ACC_MEMBER_REQ', 'GRP_MEMBER_REQ', 'JOIN_REQUEST'],
    default: 'LIKES',
    description: 'types of activities'
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
    fieldName: 'last_update_usec',
    sqlType: 'BIGINT',
    default: '0',
    excludeFromUpdate: true,
    description: 'last update time stamp'
  },
  {
    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'last_upd_usec_idx',
        columns: ['site_code', 'timeline_id', 'last_update_usec'],
        unique: false
      },
      {
        name: 'last_timeline_idx',
        columns: ['site_code', 'timeline_user_id', 'activity_type', 'timeline_id', 'user_id'],
        unique: false
      }
    ]
  }
];

const ActivitySchemaModel = DTOGenerator.genSchemaModel(activities_schema);
export type ActivityData = typeof ActivitySchemaModel;

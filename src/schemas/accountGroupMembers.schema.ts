import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const accountGroupMembers_schema_table = 'accountGroupMembers';

export const accountGroupMembers_schema: schemaIfc[] = [
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
    fieldName: 'account_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to accounts - account '
  },
  {
    fieldName: 'group_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to groups - group '
  },
  {
    fieldName: 'accountGroupMember_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to users - member'
  },
  {
    fieldName: 'accountGroupMember_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'date accountGroupMembered'
  },
  {
    fieldName: 'accountGroupMember_req_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'date accountGroupMember requested'
  },
  {
    fieldName: 'accountGroupMember_block_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'date accountGroupMember blocked'
  },
  {
    fieldName: 'accountGroupMember_status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['BLOCKED', 'REQUEST', 'OK'],
    default: 'REQUEST'
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
        name: 'user_id_idx',
        columns: ['site_code', 'user_id', 'accountGroupMember_date'],
        unique: false
      },
      {
        name: 'accountMember_status_idx',
        columns: [
          'site_code',
          'account_id',
          'accountGroupMember_status',
          'lastUpdateUsec'
        ],
        unique: false
      },
      {
        name: 'groupMember_status_idx',
        columns: [
          'site_code',
          'group_id',
          'accountGroupMember_status',
          'lastUpdateUsec'
        ],
        unique: false
      }
    ]
  }
];

const AccountGroupMemberSchemaModel = DTOGenerator.genSchemaModel(
  accountGroupMembers_schema
);
export type AccountGroupMemberData = typeof AccountGroupMemberSchemaModel;

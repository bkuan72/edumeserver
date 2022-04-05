import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const userGroups_schema_table = 'userGroups';

export const userGroups_schema: schemaIfc[] = [
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
  description: 'website identifier'
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
  {    fieldName: 'member_status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK',
        'REQUESTED',
        'BLOCK'
        ],
    default: 'OK',
    description: 'group member status'
  },
  {    fieldName: 'account_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to groups table'
  },
  {    fieldName: 'group_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to groups table'
  },
  {    fieldName: 'user_id',
  sqlType: 'BINARY(16)',
  primaryKey: false,
  uuidProperty: true,
  excludeFromUpdate: true,
  description: 'link to users table'
},
  {    fieldName: 'join_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'date user join group'
  },
  {    fieldName: 'block_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'date user block from group'
  },
  {    fieldName: 'request_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'date user request to join group'
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
        name: 'user_id_idx',
        columns: ['site_code', 'user_id', 'last_update_usec'],
        unique: false
      },
      {
        name: 'group_id_idx',
        columns: ['site_code', 'group_id', 'last_update_usec'],
        unique: false
      },
      {
        name: 'account_id_idx',
        columns: ['site_code', 'account_id', 'last_update_usec'],
        unique: false
      }
    ]
  }
];

const UserGroupSchemaModel = DTOGenerator.genSchemaModel(userGroups_schema);
export type UserGroupData = typeof UserGroupSchemaModel;
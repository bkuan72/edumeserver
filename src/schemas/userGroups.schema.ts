import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const userGroups_schema_table = 'userGroups';

export const userGroups_schema: schemaIfc[] = [
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
  {    fieldName: 'group_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {    fieldName: 'user_id',
  sqlType: 'BINARY(16)',
  primaryKey: false,
  uuidProperty: true,
  excludeFromUpdate: true
},
  {    fieldName: 'join_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false
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
        name: 'user_id_idx',
        columns: ['site_code', 'user_id', 'lastUpdatedUsec'],
        unique: true
      },
      {
        name: 'account_id_idx',
        columns: ['site_code', 'account_id', 'lastUpdatedUsec'],
        unique: true
      }
    ]
  }
];

const UserGroupSchemaModel = DTOGenerator.genSchemaModel(userGroups_schema);
export type UserGroupData = typeof UserGroupSchemaModel;
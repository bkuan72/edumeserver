import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const friends_schema_table = 'friends';

export const friends_schema: schemaIfc[] = [
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
  {    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {    fieldName: 'friend_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true
    },
  {    fieldName: 'friend_date',
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
        columns: ['site_code', 'user_id', 'friend_date'],
        unique: true
      }
    ]
  }
];

const FriendSchemaModel = DTOGenerator.genSchemaModel(friends_schema);
export type FriendData = typeof FriendSchemaModel;
import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const tokens_schema_table = 'tokens';
export const blacklist_tokens_schema_table = 'blacklist_tokens';

export const token_schema: schemaIfc[] = [
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
  {    fieldName: 'uuid',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {    fieldName: 'createTimeStamp',
    sqlType: 'VARCHAR(29)',
    size: 29,
    default: '',
    allowNull: true
  },
  {    fieldName: 'expiryInSec',
    sqlType: 'INTEGER',
    allowNull: false,
    default: '0'
  },
  {    fieldName: 'token',
    sqlType: 'VARCHAR(1024)',
    size: 1024,
    allowNull: false,
    default: ''
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'user_id_idx',
        columns: ['site_code', 'user_id'],
        unique: true
      },
      {
        name: 'uuid_idx',
        columns: ['site_code', 'uuid'],
        unique: true
      }
    ],
    enum: []
  }

];

const TokenSchemaModel = DTOGenerator.genSchemaModel(token_schema);
export type TokenData = typeof TokenSchemaModel;
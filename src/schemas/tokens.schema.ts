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
    excludeFromUpdate: true,
    enum: [],
    index: []
  },
  {    fieldName: 'site_code',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    default: '',
    excludeFromUpdate: true,
    trim: true,
    enum: [],
    index: []
  },
  {    fieldName: 'uuid',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    enum: [],
    index: []
  },
  {    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    enum: [],
    index: []
  },
  {    fieldName: 'createTimeStamp',
    sqlType: 'VARCHAR(29)',
    size: 29,
    default: '',
    allowNull: true,
    enum: [],
    index: []
  },
  {    fieldName: 'expireInMin',
    sqlType: 'INTEGER',
    allowNull: false,
    default: '0',
    enum: [],
    index: []
  },
  {    fieldName: 'token',
    sqlType: 'VARCHAR(400)',
    size: 400,
    allowNull: false,
    default: '',
    enum: [],
    index: []
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'token_idx',
        columns: ['site_code', 'token'],
        unique: true
      },
    ],
    enum: []
  }

];

const TokenSchemaModel = DTOGenerator.genSchemaModel(token_schema);
export type TokenData = typeof TokenSchemaModel;
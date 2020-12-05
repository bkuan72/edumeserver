import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const entities_schema_table = 'entities';

export const entities_schema: schemaIfc[] = [
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
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK',
        'DELETED'
        ],
    index: [],
    default: 'OK'
  },
  {    fieldName: 'date_field',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: true,
    trim: false,
    enum: [],
    index: []
  },
  {    fieldName: 'entities_code',
  sqlType: 'VARCHAR(100)',
  size: 100,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  enum: [],
  index: []
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'entities_code_idx',
        columns: ['site_code', 'entities_code'],
        unique: true
      }
    ],
    enum: []
  }
];

const EntitySchemaModel = DTOGenerator.genSchemaModel(entities_schema);
export type EntityData = typeof EntitySchemaModel;
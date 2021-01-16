import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const properties_schema_table = 'properties';

export const properties_schema: schemaIfc[] = [
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
  {    fieldName: 'name',
  sqlType: 'VARCHAR(255)',
  size: 255,
  allowNull: false,
  default: '',
  excludeFromUpdate: true,
  trim: true
  },
  {    fieldName: 'value',
  sqlType: 'VARCHAR(255)',
  size: 255,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
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
  {    fieldName: 'lastUpdateUsec',
  sqlType: 'BIGINT',
  default: '0',
  excludeFromUpdate: true
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'last_upd_usec_idx',
        columns: [ 'site_code', 'lastUpdateUsec'],
        unique: false
      }
    ]
  }
];

const PropertySchemaModel = DTOGenerator.genSchemaModel(properties_schema);
export type PropertyData = typeof PropertySchemaModel;
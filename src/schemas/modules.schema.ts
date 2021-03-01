import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const modules_schema_table = 'modules';

export const modules_schema: schemaIfc[] = [
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
    description: 'Status of record'
  },
  {    fieldName: 'module_code',
  sqlType: 'VARCHAR(100)',
  size: 100,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  description: 'module identifier code'
  },
  {    fieldName: 'description',
  sqlType: 'VARCHAR(40)',
  size: 40,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  description: 'module description'
  },
  {    fieldName: 'lastUpdateUsec',
  sqlType: 'BIGINT',
  default: '0',
  excludeFromUpdate: true,
  description: 'last update timestamp'
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'module_code_idx',
        columns: ['site_code', 'module_code'],
        unique: true
      },
      {
        name: 'last_upd_usec_idx',
        columns: [ 'site_code', 'lastUpdateUsec'],
        unique: false
      }
    ]
  }
];

const ModuleSchemaModel = DTOGenerator.genSchemaModel(modules_schema);
export type ModuleData = typeof ModuleSchemaModel;
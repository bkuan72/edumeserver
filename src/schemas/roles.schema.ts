import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const roles_schema_table = 'roles';

export const roles_schema: schemaIfc[] = [
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
  {    fieldName: 'role_code',
  sqlType: 'VARCHAR(10)',
  size: 10,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  description: 'role identifier code'
  },
  {    fieldName: 'description',
  sqlType: 'VARCHAR(40)',
  size: 40,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  description: 'role description'
  },
  {
    fieldName: 'add_ok',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: true,
    description: 'add records ok'
  },
  {
    fieldName: 'edit_ok',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: true,
    description: 'edit records ok'
  },
  {
    fieldName: 'delete_ok',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: true,
    description: 'delete records ok'
  },
  {
    fieldName: 'configure_ok',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: true,
    description: 'configure website ok'
  },
  {
    fieldName: 'dev_ok',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: true,
    description: 'develop website - see DTOs ok'
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
        name: 'role_code_idx',
        columns: ['site_code', 'role_code'],
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

const RoleSchemaModel = DTOGenerator.genSchemaModel(roles_schema);
export type RoleData = typeof RoleSchemaModel;
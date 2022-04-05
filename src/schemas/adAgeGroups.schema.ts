import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const adAgeGroups_schema_table = 'adAgeGroups';

export const adAgeGroups_schema: schemaIfc[] = [
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
    fieldName: 'adAgeGroup_code',
    sqlType: 'VARCHAR(30)',
    size: 30,
    allowNull: false,
    default: '',
    excludeFromUpdate: false,
    trim: true,
    description: 'age group'
  },
  {
    fieldName: 'start_age',
    sqlType: 'INT',
    default: '0',
    description: 'Start Age'
  },
  {
    fieldName: 'end_age',
    sqlType: 'INT',
    default: '0',
    description: 'End Age'
  },
  {
    fieldName: 'last_update_usec',
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
        name: 'adAgeGroups_code_idx',
        columns: ['site_code', 'adAgeGroup_code'],
        unique: true
      },
      {
        name: 'last_upd_usec_idx',
        columns: ['site_code', 'last_update_usec'],
        unique: false
      }
    ]
  }
];

const AdAgeGroupsSchemaModel = DTOGenerator.genSchemaModel(adAgeGroups_schema);
export type AdAgeGroupData = typeof AdAgeGroupsSchemaModel;

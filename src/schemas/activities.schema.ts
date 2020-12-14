import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const activities_schema_table = 'activities';

export const activities_schema: schemaIfc[] = [
  {
    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {
    fieldName: 'activity_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: true,
    trim: false
  },
  {
    fieldName: 'message',
    sqlType: 'TEXT',
    allowNull: false,
    excludeFromUpdate: false,
    trim: false
  },
  {
    fieldName: 'user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {
    fieldName: 'activity_user_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true
  },
  {
    fieldName: 'site_code',
    sqlType: 'VARCHAR(20)',
    size: 20,
    allowNull: false,
    default: '',
    excludeFromUpdate: true,
    trim: true
  },
  {
    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK', 'DELETED'],
    default: 'OK'
  },
  {
    fieldName: 'lastUpdateUsec',
    sqlType: 'BIGINT',
    default: '0',
    excludeFromUpdate: true
  },
  {
    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'last_upd_usec_idx',
        columns: ['site_code', 'user_id', 'lastUpdatedUsec'],
        unique: false
      }
    ]
  }
];

const ActivitySchemaModel = DTOGenerator.genSchemaModel(activities_schema);
export type ActivityData = typeof ActivitySchemaModel;

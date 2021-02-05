import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const adActivities_schema_table = 'adActivities';

export const adActivities_schema: schemaIfc[] = [
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
  {    fieldName: 'activity_type',
    sqlType: 'ENUM',
    size: 10,
    enum: ['CLICKED',
        'SEARCHED',
        'ABUSED'
        ],
    default: 'CLICKED',
    description: 'Status of record'
    },
  {    fieldName: 'advertisement_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to advertisements table'
  },
  {
    fieldName: 'hit_count',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: true,
    description: 'advert activity hit count'
  },
  {    fieldName: 'last_activity_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: ' date of last activity'
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
        name: 'adActivity_idx',
        columns: ['site_code', 'activity_type', 'advertisement_id'],
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

const AdActivitySchemaModel = DTOGenerator.genSchemaModel(adActivities_schema);
export type AdActivityData = typeof AdActivitySchemaModel;
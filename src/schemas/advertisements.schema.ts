import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const advertisements_schema_table = 'advertisements';

export const advertisements_schema: schemaIfc[] = [
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
  {    fieldName: 'account_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    enum: [],
    index: []
  },
  {    fieldName: 'header',
  sqlType: 'VARCHAR(100)',
  size: 100,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  enum: [],
  index: []
  },
  {    fieldName: 'sub_header',
  sqlType: 'VARCHAR(100)',
  size: 100,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  enum: [],
  index: []
  },
  {    fieldName: 'url',
  sqlType: 'VARCHAR(100)',
  size: 100,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  enum: [],
  index: []
  },
  {    fieldName: 'excerpt',
  sqlType: 'TEXT',
  size: 0,
  allowNull: true,
  excludeFromUpdate: false,
  trim: true,
  enum: [],
  index: []
  },
  {    fieldName: 'keywords',
  sqlType: 'VARCHAR(100)',
  size: 100,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  enum: [],
  index: []
  },
  {    fieldName: 'start_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    enum: [],
    index: []
  },
  {    fieldName: 'end_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    enum: [],
    index: []
  },
  {    fieldName: 'priority_code',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
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
  {    fieldName: 'lastUpdateUsec',
  sqlType: 'BIGINT',
  default: '0',
  excludeFromUpdate: true
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'advert_date_pri_idx',
        columns: ['site_code', 'start_date', 'priority_code'],
        unique: true
      },
      {
        name: 'last_upd_usec_idx',
        columns: [ 'site_code', 'lastUpdatedUsec'],
        unique: false
      }
    ],
    enum: []
  }
];

const AdvertisementSchemaModel = DTOGenerator.genSchemaModel(advertisements_schema);
export type AdvertisementData = typeof AdvertisementSchemaModel;
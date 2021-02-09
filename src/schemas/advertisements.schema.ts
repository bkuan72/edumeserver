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
  {    fieldName: 'advert_by',
    sqlType: 'ENUM',
    size: 10,
    enum: ['USER',
        'ACCOUNT',
        'GROUP'
        ],
    default: 'USER',
    description: 'identifier type for source_id'
  },
  {    fieldName: 'ad_by_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to either users, accounts, groups'
  },
  {    fieldName: 'header',
  sqlType: 'VARCHAR(100)',
  size: 100,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  description: 'advertisement header'
  },
  {    fieldName: 'sub_header',
  sqlType: 'VARCHAR(100)',
  size: 100,
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  description: 'advertisement sub header'
  },
  {    fieldName: 'url',
  sqlType: 'TEXT',
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  description: 'external website link'
  },
  {    fieldName: 'excerpt',
  sqlType: 'TEXT',
  default: '',
  allowNull: true,
  excludeFromUpdate: false,
  trim: true,
  description: 'advertisement excerpt'
  },
  {
    fieldName: 'category',
    sqlType: 'TEXT',
    excludeFromUpdate: false,
    trim: true,
    description: 'a comma delimited string of categories use for filtering'
  },
  {    fieldName: 'keywords',
  sqlType: 'TEXT',
  allowNull: false,
  default: '',
  excludeFromUpdate: false,
  trim: true,
  description: 'a comma delimited string of keywords use for filtering'
  },
  {    fieldName: 'image',
    sqlType: 'MEDIUMBLOB',
    default: '',
    description: 'image to be display as part of advert'
  },
  {    fieldName: 'start_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'start date of advertisement'
  },
  {    fieldName: 'end_date',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'end date of advertisement'
  },
  {    fieldName: 'priority_code',
    sqlType: 'VARCHAR(25)',
    size: 25,
    allowNull: false,
    excludeFromUpdate: false,
    trim: false,
    description: 'code for identifying advertisement priority'
  },
  {
    fieldName: 'address',
    sqlType: 'TEXT',
    size: 255,
    allowNull: true,
    default: '',
    description: 'Address for advertisement'
  },
  {
    fieldName: 'suburb',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: true,
    default: '',
    trim: true,
    description: 'Suburb'
  },
  {
    fieldName: 'city',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: true,
    default: '',
    trim: true,
    description: 'City'
  },
  {
    fieldName: 'state',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: true,
    default: '',
    trim: true,
    description: 'State'
  },
  {
    fieldName: 'country',
    sqlType: 'VARCHAR(40)',
    size: 40,
    allowNull: true,
    default: '',
    trim: true,
    description: 'Country'
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
  {    fieldName: 'lastUpdateUsec',
  sqlType: 'BIGINT',
  default: '0',
  excludeFromUpdate: true
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'advert_source_idx',
        columns: ['site_code', 'advert_by', 'ad_by_id', 'start_date', 'priority_code'],
        unique: true
      },
      {
        name: 'advert_date_pri_idx',
        columns: ['site_code', 'start_date', 'priority_code'],
        unique: true
      },
      {
        name: 'last_upd_usec_idx',
        columns: [ 'site_code', 'lastUpdateUsec'],
        unique: false
      }
    ],
    enum: []
  }
];

const AdvertisementSchemaModel = DTOGenerator.genSchemaModel(advertisements_schema);
export type AdvertisementData = typeof AdvertisementSchemaModel;
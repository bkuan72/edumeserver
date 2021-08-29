import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const member_security_schema_table = 'member_security';

export const member_security_schema: schemaIfc[] = [
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
  {    fieldName: 'member_id',
    sqlType: 'BINARY(16)',
    primaryKey: false,
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'link to accountGroupMembers table'
  },
  {
    fieldName: 'allow_post',
    sqlType: 'BOOLEAN',
    default: '0',
    description: 'allow posting on account profile'
  },
  {
    fieldName: 'allow_comment',
    sqlType: 'BOOLEAN',
    default: '0',
    description: 'allow comment on account profile'
  },
  {
    fieldName: 'allow_upload',
    sqlType: 'BOOLEAN',
    default: '0',
    description: 'allow upload media on account profile'
  },
  {
    fieldName: 'allow_update_profile',
    sqlType: 'BOOLEAN',
    default: '0',
    description: 'allow update account profile'
  },
  {
    fieldName: 'allow_add_member',
    sqlType: 'BOOLEAN',
    default: '0',
    description: 'allow add member'
  },
  {
    fieldName: 'allow_remove_member',
    sqlType: 'BOOLEAN',
    default: '0',
    description: 'allow remove member'
  },
  {
    fieldName: 'allow_ctrl_member',
    sqlType: 'BOOLEAN',
    default: '0',
    description: 'allow control access member'
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
        name: 'member_security_code_idx',
        columns: ['site_code', 'member_id'],
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

const MemberSecuritySchemaModel = DTOGenerator.genSchemaModel(member_security_schema);
export type MemberSecurityData = typeof MemberSecuritySchemaModel;
import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const logs_schema_table = 'logs';

export const logs_schema: schemaIfc[] = [
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
    {    fieldName: 'entryDate',
      sqlType: 'VARCHAR(25)',
      size: 25,
      allowNull: false,
      excludeFromUpdate: true,
      trim: false
    },
    {    fieldName: 'level',
      sqlType: 'INT',
      size: 0,
      allowNull: false,
      excludeFromUpdate: true,
      trim: true
    },
    {    fieldName: 'message',
      sqlType: 'TEXT',
      excludeFromUpdate: true
    },
    {    fieldName: 'extraInfo',
      sqlType: 'TEXT',
      excludeFromUpdate: true
    }
];

export enum LogLevel
{
    All = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Fatal = 5,
    Off = 6
}

const LogSchemaModel = DTOGenerator.genSchemaModel(logs_schema);
export type LogData = typeof LogSchemaModel;
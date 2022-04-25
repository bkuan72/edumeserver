/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { indexIfc, schemaIfc } from './DbModule';
// import { bcryptHash, cryptoStr } from './cryto';
import SqlStr = require('sqlstring');
import { bcryptHash, cryptoStr } from './cryto';
import CommonFn from './CommonFnModule';
import DTOGenerator from './ModelGenerator';
import e = require('express');
import { fieldValueIfc } from '../interfaces/fieldValue.interface';
/**
 * SqlFormatter Class
 * This class provide helper functions for formatting SQL syntax
 */
export class SqlFormatter {
  /**
   * Format Array for UPDATE SQL
   * @param obj -  data object
   * @param objProp - data object property name
   * @param prop - schematic property
   * @param valueArray - return stringed property value array
   */
  static formatUpdateArray = (
    obj: any,
    objProp: string,
    prop: schemaIfc,
    valueArray: string[]
  ): Promise<void> => {
    return new Promise((lresolve) => {
      if (
        prop.fieldName === 'last_update_usec' ||
        prop.fieldName === 'when_updated_usec' ||
        prop.fieldName === 'last_modified_date'
      ) {
        const dt = new Date();
        if (
          prop.fieldName === 'last_update_usec' ||
          prop.fieldName === 'when_updated_usec'
        ) {
          valueArray.push(
            prop.fieldName + ' = ' + SqlStr.escape(dt.valueOf().toString())
          );
        } else { // last_modified_date
          valueArray.push(
            prop.fieldName + ' = ' + SqlStr.escape(CommonFn.toMySqlDate(dt))
          );
        }
        lresolve();
      } else
      if (prop.fieldName === 'last_modified_by') {
        if (CommonFn.hasProperty(obj, '_req_action_user_')) {
          valueArray.push('last_modified_by = ' + SqlStr.escape(obj._req_action_user_));
        } else {
          valueArray.push('last_modified_by = ' + SqlStr.escape('system'));
        }
        lresolve();
      } else {
        if (prop.uuidProperty) {
          if (prop.fieldName === 'id') {
            valueArray.push(prop.fieldName + ' = UUID_TO_BIN(@uuidId)');
          } else {
            if (CommonFn.isEmpty(obj[objProp])) {
              valueArray.push(prop.fieldName + ' = 0 ');
            } else {
              valueArray.push(
                prop.fieldName +
                  ' = UUID_TO_BIN(' +
                  SqlStr.escape(obj[objProp]) +
                  ')'
              );
            }
          }
          lresolve();
        } else {
          if (typeof obj[objProp] === 'string') {
            if (
              prop.encrypt !== undefined &&
              prop.encrypt &&
              !CommonFn.isEmpty(obj[objProp])
            ) {
              const escStrValue = obj[objProp];
              if (prop.bcryptIt !== undefined && prop.bcryptIt) {
                bcryptHash(escStrValue)
                  .then((secret) => {
                    valueArray.push(
                      prop.fieldName + ' = ' + SqlStr.escape(secret)
                    );
                    lresolve();
                  })
                  .catch((err) => {
                    throw err;
                  });
              } else {
                cryptoStr(escStrValue)
                  .then((secret) => {
                    valueArray.push(
                      prop.fieldName + ' = ' + SqlStr.escape(secret)
                    );
                    lresolve();
                  })
                  .catch((err) => {
                    throw err;
                  });
              }
            } else {
              if (obj[objProp] == null || obj[objProp] === 'null') {
                valueArray.push(
                  prop.fieldName + ' = NULL'
                );
              } else
              {
                if (prop.sqlType?.includes('DATE')) {
                  const dt = new Date(obj[objProp]);
                  if (prop.sqlType === 'DATE') {
                    valueArray.push(prop.fieldName + ' = ' + SqlStr.escape(CommonFn.toMySqlDate(dt)));
                  } else {
                    valueArray.push(prop.fieldName + ' = ' + SqlStr.escape(CommonFn.toMySqlDateTime(dt)));
                  }
                } else {
                  valueArray.push(prop.fieldName + ' = ' + SqlStr.escape(obj[objProp]));
                }
              }
              lresolve();
            }
          } else {
            if (typeof obj[objProp] == 'object') {
              valueArray.push(
                prop.fieldName +
                  ' = ' +
                  SqlStr.escape(JSON.stringify(obj[objProp]))
              );
            } else {
              if (prop.sqlType?.includes('DATE')) {
                if (prop.sqlType === 'DATE') {
                  valueArray.push(prop.fieldName + ' = ' + SqlStr.escape(CommonFn.toMySqlDate(obj[objProp])));
                } else {
                  valueArray.push(prop.fieldName + ' = ' + SqlStr.escape(CommonFn.toMySqlDateTime(obj[objProp])));
                }

              } else {
                valueArray.push(prop.fieldName + ' = ' + SqlStr.escape(obj[objProp]));
              }
            }
            lresolve();
          }
        }
      }
    });
  };
/**
 * Format Array for INSERT SQL
 * @param fieldValues - field and value to replace the default
 * @param obj - data object
 * @param objProp - data object property name
 * @param prop - schema property
 * @param valueArray - return stringed property value array
 * @returns 
 */
  static formatInsertArray = (
    fieldValues: fieldValueIfc[],
    obj: any,
    objProp: string,
    prop: schemaIfc,
    valueArray: string[]
  ): Promise<void> => {
    return new Promise((lresolve) => {
      const fld = getFieldIdx(fieldValues, prop);
      if (fld != -1) {
        obj[objProp] = fieldValues[fld].value;
        valueArray.push(SqlStr.escape(obj[objProp]));
        lresolve();
      } else
      if (prop.fieldName === 'last_update_usec' ||
          prop.fieldName === 'when_updated_usec') {
        const dt = new Date();
        obj[objProp] = dt.valueOf().toString()
        valueArray.push(SqlStr.escape(obj[objProp]));
        lresolve();
      } else
      if (prop.fieldName === 'created_date' ||
          prop.fieldName === 'last_modified_date'
          ) {
        const dt = new Date();
        obj[objProp] = CommonFn.toMySqlDate(dt);
        valueArray.push(SqlStr.escape(obj[objProp]));
        lresolve();
      } else
      if (prop.fieldName === 'created_by') {
        obj[objProp] =  'system';
        valueArray.push(SqlStr.escape(obj[objProp]));
        lresolve();
      } else
      {
        if (prop.uuidProperty) {
          if (prop.fieldName === 'id') {
            valueArray.push('UUID_TO_BIN(@uuidId)');
          } else {
            if (CommonFn.isEmpty(obj[objProp])) {
              valueArray.push('0');
            } else {
              valueArray.push(
                'UUID_TO_BIN(' + SqlStr.escape(obj[objProp]) + ')'
              );
            }
          }
          lresolve();
        } else {
          if (typeof obj[objProp] === 'string') {
            if (
              prop.encrypt !== undefined &&
              prop.encrypt &&
              !CommonFn.isEmpty(obj[objProp])
            ) {
              const escStrValue = obj[objProp];
              if (prop.bcryptIt !== undefined && prop.bcryptIt) {
                bcryptHash(escStrValue)
                  .then((secret) => {
                    valueArray.push(SqlStr.escape(secret));
                    lresolve();
                  })
                  .catch((err) => {
                    throw err;
                  });
              } else {
                cryptoStr(escStrValue)
                  .then((secret) => {
                    valueArray.push(SqlStr.escape(secret));
                    lresolve();
                  })
                  .catch((err) => {
                    throw err;
                  });
              }
            } else {
              if (obj[objProp] == null || obj[objProp] === 'null') {
                valueArray.push('NULL');
              } else {
                if (prop.sqlType?.includes('DATE')) {
                  const dt = new Date(obj[objProp]);
                  if (prop.sqlType === 'DATE') {
                    valueArray.push( SqlStr.escape(CommonFn.toMySqlDate(dt)));
                  } else {
                    valueArray.push( SqlStr.escape(CommonFn.toMySqlDateTime(dt)));
                  }

                } else {
                  valueArray.push(SqlStr.escape(obj[objProp]));
                }
              }
              lresolve();
            }
          } else {
            if (typeof obj[objProp] == 'object') {
              valueArray.push(SqlStr.escape(JSON.stringify(obj[objProp])));
            } else {
              if (prop.sqlType?.includes('DATE')) {
                if (prop.sqlType === 'DATE') {
                  valueArray.push( SqlStr.escape(CommonFn.toMySqlDate(obj[objProp])));
                } else {
                  valueArray.push( SqlStr.escape(CommonFn.toMySqlDateTime(obj[objProp])));
                }                valueArray.push( SqlStr.escape(CommonFn.toMySqlDate(obj[objProp])));

              } else {
                valueArray.push(SqlStr.escape(obj[objProp]));
              }
            }
            lresolve();
          }
        }
      }
    });
  };

  /**
   * This function format a quoted coma delimited string list
   * @param sql - SQL buffer
   * @param arr - array of string values
   */
  static appendStrList = (sql: string, arr: string[]) => {
    let ft = true;
    arr.forEach((enumVal) => {
      if (ft) {
        ft = false;
      } else {
        sql += ',';
      }
      sql += "'" + enumVal + "'";
    });
    return sql;
  };

  /**
   * This function format the SQL syntax for and index property
   * @param sql - SQL buffer
   * @param index - index property
   */
  static appendIdxColumnList = (sql: string, index: indexIfc) => {
    let firstCol = true;
    index.columns.forEach((column: string) => {
      if (firstCol) {
        firstCol = false;
      } else {
        sql += ', ';
      }
      sql += column;
    });
    return sql;
  };

  /**
   * This function format the SQL syntax to create a database index
   * @param sql - the SQL string
   * @param indexes - index properties
   */
  static formatCreateIndexSql = (
    dbName: string,
    tableName: string,
    index: indexIfc
  ) => {
    let sql = '';
    sql +=
      ' CREATE INDEX ' +
      index.name +
      ' ON `' +
      dbName +
      '`.`' +
      tableName +
      '`  (';
    sql = SqlFormatter.appendIdxColumnList(sql, index);
    sql += ');';
    return sql;
  };
  /**
   * This function formats the database column definition based on column schema
   * @param column  - column schema
   */
  static formatColumnDefinition = (table: string, column: schemaIfc) => {
    let sql = '';
    if (column.fieldName != 'INDEX') {
      for (const prop in column) {
        let dropOut = false;
        switch (prop) {
          case 'fieldName':
            sql += column[prop];
            sql += ' ';
            break;
          case 'sqlType':
            sql += column[prop];
            if (column.primaryKey) {
              dropOut = true;
            }
            break;
          case 'allowNull':
            sql += ' ';
            if (column[prop] == true) {
              sql += 'NULL';
            } else {
              sql += 'NOT NULL';
            }
            break;
          case 'default':
            if (
              !column.sqlType?.includes('TEXT') &&
              !column.sqlType?.includes('BLOB')
            ) {
              if (column.sqlType?.includes('VARCHAR')) {
                sql += ' ';
                sql += "DEFAULT '" + column[prop];
                sql += "'";
              } else {
                sql += ' ';
                sql += "DEFAULT '" + column[prop]?.toString();
                sql += "'";
              }
            } else {
              sql += ' ';
            }
            break;
          case 'enum':
            if (column.sqlType?.includes('ENUM')) {
              sql += '(';
              if (column.enum) {
                sql = SqlFormatter.appendStrList(sql, column.enum);
              }
              sql += ')';
            }
            break;
        }
        if (dropOut) {
          break;
        }
      }
    }
    return sql;
  };

  /**
   * This function formats the SQL INSERT syntax
   * @param obj - data object
   * @param table - table name
   * @param schema - table schema
   */
  static formatInsert = (
    fieldValues: fieldValueIfc[],
    obj: any,
    table: string,
    schema: schemaIfc[],
    toCamelCase?: boolean
  ): Promise<string> => {
    return new Promise((resolve) => {
      let sql = '';
      let fldCnt = 0;

      ({ sql, fldCnt } = SqlFormatter.formatInsertFields(table, schema, toCamelCase, obj, sql));


      SqlFormatter.formatInsertRecord(schema, toCamelCase, obj, fieldValues, fldCnt, sql).then ((sql) => {
        resolve(sql);
      });

    });
  };

  /**
   * This function formats the SQL INSERT for Multiple Records syntax
   * @param obj - data object
   * @param table - table name
   * @param schema - table schema
   */
     static formatInsertRecords = (
      fieldValues: fieldValueIfc[],
      objs: any[],
      table: string,
      schema: schemaIfc[],
      toCamelCase?: boolean
    ): Promise<string> => {
      return new Promise((resolve) => {
        let sql = '';
        let fldCnt = 0;

        const appendInsertRecord = (idx: number) => {
          if (idx >= objs.length) {
            resolve(sql);
          }
          const obj = objs[idx];
          if (idx === 0) {
            ({ sql, fldCnt } = SqlFormatter.formatInsertFields(table, schema, toCamelCase, obj, sql));
          }

          SqlFormatter.formatInsertRecord(schema, toCamelCase, obj, fieldValues, fldCnt, sql).then((sql) => {
            appendInsertRecord(idx + 1);
          })
        }

        appendInsertRecord(0);

      });
    };

  private static formatInsertRecord(schema: schemaIfc[],
                                    toCamelCase: boolean | undefined,
                                    obj: any, fieldValues: fieldValueIfc[],
                                    fldCnt: number,
                                    sql: string): Promise<string>  {
    return new Promise((resolve) => {
      const valueArray: string[] = [];
      let valueStr = 'VALUES (';
      let first = true;
      let cnt = 0;
      let promiseChain: Promise<any> = Promise.resolve();
      schema.forEach(async (prop: schemaIfc) => {
        let objProp = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
        if (CommonFn.hasProperty(obj, objProp) ||
          prop.fieldName === 'created_date' ||
          prop.fieldName === 'created_by' ||
          prop.fieldName === 'when_updated_usec' ||
          prop.fieldName === 'last_update_usec') {
          promiseChain = promiseChain
            .then(async () => {
              return await SqlFormatter.formatInsertArray(
                fieldValues,
                obj,
                objProp,
                prop,
                valueArray
              );
            })
            .then(() => {
              cnt++;
              if (cnt >= fldCnt) {
                let idx = 0;
                first = true;
                schema.forEach(async (prop: schemaIfc) => {
                  objProp = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
                  if (CommonFn.hasProperty(obj, objProp)) {
                    if (first) {
                      first = false;
                    } else {
                      valueStr += ', ';
                    }
                    valueStr += valueArray[idx++];
                  }
                });
                sql += valueStr + ') ';
                resolve(sql);
              }
            })
            .catch((err) => {
              throw err;
            });
        }
      });
    })

  }

  private static formatInsertFields(table: string, schema: schemaIfc[], toCamelCase: boolean | undefined, obj: any, sql: string) {
    let first = true;
    let fldCnt = 0;
    sql += 'INSERT INTO ' + table + ' ('
    schema.forEach(async (prop: schemaIfc) => {
      const objProp = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
      if (CommonFn.hasProperty(obj, objProp) ||
        prop.fieldName === 'created_date' ||
        prop.fieldName === 'created_by' ||
        prop.fieldName === 'when_updated_usec' ||
        prop.fieldName === 'last_update_usec') {
        appendFieldProp(prop.fieldName);
      }

      function appendFieldProp(fldName: string) {
        if (first) {
          first = false;
        } else {
          sql += ', ';
        }
        sql += fldName;
        fldCnt++;
      }
    });
    sql += ') '
    return { sql, fldCnt };
  }

  /**
   * This function determines if properties are included in SQL statement based on fmtPropArr, function will return true
   * @param prop - schema property
   * @param fmtPropArr - prop fieldName array to include in SQL statement
   * @returns true/false
   */
  static includeInSql(prop: schemaIfc, fmtPropArr?: string[]): boolean {
    let includeInSql = false;
    if (fmtPropArr != undefined && fmtPropArr.length > 0) {
      fmtPropArr.some((fmtProp) => {
        if (fmtProp === prop.fieldName) {
          includeInSql = true;
          return true;
        }
      });
    } else {
      includeInSql = true;
    }
    return includeInSql;
  }

  /**
   * This function determines if properties are excluded from SQL statement based on the exclPropArr, function will return true if excluded
   * @param prop - schema property
   * @param exclPropArr - prop fieldName array to include in SQL statement
   * @returns true/false
   */
  static excludeFromSql(prop: schemaIfc, exclPropArr?: string[]): boolean {
    let exclSql = false;
    if (exclPropArr != undefined && exclPropArr.length > 0) {
      exclPropArr.some((fmtProp) => {
        if (fmtProp === prop.fieldName) {
          exclSql = true;
          return true;
        }
      });
    }
    return exclSql;
  }

  /**
   * This function formats the SQL SELECT statement, if fmtPropArr is provided then only
   * those properties with fieldNames in the array would be format into the SQL statement
   *
   * @param table - entity table name
   * @param schema - entity schema
   * @param ignoreExclFromSelect - optional columns to exclude from SELECT
   * @param fmtPropArr - optional Property name array
   */
  static formatSelect = (
    table: string,
    schema: schemaIfc[],
    ignoreExclFromSelect?: boolean,
    fmtPropArr?: string[]
  ): string => {
    let sql = 'SELECT ';
    let first = true;
    schema.forEach((prop) => {
      if (prop.fieldName !== 'INDEX') {
        if (
          CommonFn.isUndefined(prop.excludeFromSelect) ||
          ignoreExclFromSelect ||
          !prop.excludeFromSelect
        ) {
          if (
            ignoreExclFromSelect ||
            SqlFormatter.includeInSql(prop, fmtPropArr)
          ) {
            if (!CommonFn.isUndefined(prop.uuidProperty) && prop.uuidProperty) {
              if (first) {
                first = false;
              } else {
                sql += ', ';
              }
              sql += 'BIN_TO_UUID(' + prop.fieldName + ') ';
              sql += prop.fieldName;
            } else {
              if (first) {
                first = false;
              } else {
                sql += ', ';
              }
              sql += prop.fieldName;
            }
          }
        }
      }
    });
    sql += ' FROM ' + table + '';
    return sql;
  };

  /**
   * This function formats the SQL SELECT statement in tableName.columnName format, if fmtPropArr is provided then only
   * those properties with fieldNames in the array would be format into the SQL statement
   *
   * @param table - entity table name
   * @param schema - entity schema
   * @param ignoreExclFromSelect - optional columns to exclude from SELECT
   * @param fmtPropArr - optional Property name array
   */
  static formatTableSelect = (
    table: string,
    schema: schemaIfc[],
    exclColumnArray?: string[],
    ignoreExclFromSelect?: boolean,
    fmtPropArr?: string[]
  ): string => {
    let sql = '';
    let first = true;
    schema.forEach((prop) => {
      if (prop.fieldName !== 'INDEX') {
        if (
          exclColumnArray === undefined ||
          !SqlFormatter.excludeFromSql(prop, exclColumnArray)
        ) {
          if (
            CommonFn.isUndefined(prop.excludeFromSelect) ||
            ignoreExclFromSelect ||
            !prop.excludeFromSelect
          ) {
            if (
              ignoreExclFromSelect ||
              SqlFormatter.includeInSql(prop, fmtPropArr)
            ) {
              if (
                !CommonFn.isUndefined(prop.uuidProperty) &&
                prop.uuidProperty
              ) {
                if (first) {
                  first = false;
                } else {
                  sql += ', ';
                }
                sql += 'BIN_TO_UUID(' + table + '.' + prop.fieldName + ') ';
              } else {
                if (first) {
                  first = false;
                } else {
                  sql += ', ';
                }
                sql += table + '.' + prop.fieldName;
              }
            }
          }
        }
      }
    });
    return sql;
  };

  /**
   *
   * @param startCol - start idx of the sqlRowData to transpose
   * @param dataObj  - data object to transpose data to
   * @param schema   - schema used to generate the SQL SELECT statement
   * @param sqlRowData - result set of a row of SQL data
   * @param ignoreExclFromSelect - columns to ignore in the schema
   * @param fmtPropArr
   */
  static transposeTableSelectColumns = (
    startCol: number,
    dataObj: any,
    schema: schemaIfc[],
    sqlRowData: any[],
    exclColumnArray?: string[],
    ignoreExclFromSelect?: boolean,
    fmtPropArr?: string[],
    toCamelCase?: boolean
  ): number => {
    schema.forEach((prop) => {
      if (prop.fieldName !== 'INDEX') {
        if (
          exclColumnArray === undefined ||
          !SqlFormatter.excludeFromSql(prop, exclColumnArray)
        ) {
          if (
            CommonFn.isUndefined(prop.excludeFromSelect) ||
            ignoreExclFromSelect ||
            !prop.excludeFromSelect
          ) {
            if (
              ignoreExclFromSelect ||
              SqlFormatter.includeInSql(prop, fmtPropArr)
            ) {
              const propValue = SqlFormatter.translatePropValue(
                prop.sqlType,
                sqlRowData,
                startCol
              );
              const objProp = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
              dataObj[objProp] = propValue;
              startCol++;
            }
          }
        }
      }
    });
    return startCol;
  };

  /**
   * This function returns an array of column names used for SQL SELECT
   *
   * @param columnArray - array of column names
   * @param columnArray - entity schema
   * @param ignoreExclFromSelect - optional columns to exclude from SELECT
   * @param fmtPropArr - optional Property name array
   */
  static transposeTableSelectColumnArray = (
    startCol: number,
    dataObj: any,
    columnArray: string[],
    sqlRowData: any[]
  ): number => {
    columnArray.forEach((fieldName) => {
      dataObj[fieldName] = sqlRowData[startCol++];
    });
    return startCol;
  };

  /**
   * This function transpose the data return from SQL statement into
   * an object defined with properties from the columns array
   * NOTE make sure the sequencing of the column matches the SELECT statement
   *
   * @param columns - array of columns name
   * @param dataRow - data rows returned by SQL statement
   */
  static transposeColumnResultSet = (
    columns: string[],
    dataRow: any[]
  ): any => {
    let idx = 0;
    let data = Object.create(null);
    columns.forEach((column) => {
      data = DTOGenerator.defineProperty(data, column, dataRow[idx++]);
    });

    return data;
  };

  /**
   * This function transpose the data return from SQL statement into
   * an object defined with properties from the schema taking into account
   *  ignoreExclFromSelect and fmtPropArr
   *
   * @param schema - entity schema
   * @param ignoreExclFromSelect - columns to be excluded
   * @param fmtPropArr - Property name array
   * @param dataRow - data rows returned by SQL statement
   */
  static transposeResultSet = (
    schema: schemaIfc[],
    ignoreExclFromSelect: boolean | undefined,
    fmtPropArr: string[] | undefined,
    dataRow: any[],
    toCamelCase?: boolean,
    exclColumnArray?: string[] | undefined
  ): any => {
    let idx = 0;
    let data = Object.create(null);
    schema.forEach((prop) => {
      if (prop.fieldName !== 'INDEX') {
        if (
          exclColumnArray === undefined ||
          !SqlFormatter.excludeFromSql(prop, exclColumnArray)
        ) {
          if (
            CommonFn.isUndefined(prop.excludeFromSelect) ||
            ignoreExclFromSelect ||
            !prop.excludeFromSelect
          ) {
            if (
              ignoreExclFromSelect ||
              SqlFormatter.includeInSql(prop, fmtPropArr)
            ) {
              const propValue = SqlFormatter.translatePropValue(
                prop.sqlType,
                dataRow,
                idx
              );
              data = DTOGenerator.defineProperty(
                data,
                CommonFn.toCamelCase(prop.fieldName, toCamelCase),
                propValue
              );
              idx++;
            }
          }
        }

      }
    });

    return data;
  };

  static translatePropValue = (
    sqlType: string | undefined,
    dataRow: any,
    idx: number
  ): any => {
    let propValue: any;
    if (sqlType?.includes('BLOB')) {
      const blob = dataRow[idx++] as Buffer;
      propValue = blob.toString('utf-8');
    } else {
      if (sqlType?.includes('BOOLEAN')) {
        propValue = false;
        if (dataRow[idx] > 0) {
          propValue = true;
        }
      } else {
        if (sqlType === 'DATE') {
          propValue = CommonFn.toMySqlDate(dataRow[idx]);
        } else {
          propValue = dataRow[idx];
        }

      }
    }
    return propValue;
  };

  static translateFldPropValue = (
    sqlType: string | undefined,
    fldValue: any
  ): any => {
    let propValue: any;
    if (sqlType?.includes('BLOB')) {
      const blob = fldValue as Buffer;
      propValue = blob.toString('utf-8');
    } else {
      if (sqlType?.includes('BOOLEAN')) {
        propValue = false;
        if (fldValue > 0) {
          propValue = true;
        }
      } else {
        if (sqlType === 'DATE') {
          propValue = CommonFn.toMySqlDate(fldValue);
        } else {
          propValue = fldValue;
        }

      }
    }
    return propValue;
  };

  /**
   * This function formats the SQL UPDATE statement based on schema configuration and data object properties
   * it checks schema property excludeFromUpdate to determine if data property can be updated
   * @param table - entity table name
   * @param schema - entity schema
   * @param data - data object
   */
  static formatUpdate = (
    table: string,
    schema: schemaIfc[],
    data: any,
    toCamelCase?: boolean,
    excludeFields?: string[]
  ): Promise<string> => {
    return new Promise((resolve) => {
      let propCnt = 0;
      function excludedField(prop: schemaIfc) {
        let skip = false;
        if (excludeFields !== undefined && excludeFields.length > 0) {
          excludeFields.some((fldName) => {
            if (fldName === prop.fieldName) {
              skip = true;
              return true;
            }
          });
        }
        return skip;
      }
      schema.forEach(async (prop: schemaIfc) => {
        const skip = excludedField(prop);
        if (!skip && prop != undefined && prop.fieldName != 'id') {
          if (
            prop.fieldName === 'last_modified_date' ||
            prop.fieldName === 'last_modified_by' ||
            prop.fieldName === 'when_updated_usec' ||
            prop.fieldName === 'last_update_usec' ) {
              propCnt++;
          } else
          if (
            prop.excludeFromUpdate === undefined ||
            !prop.excludeFromUpdate
          ) {
            const objProp = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
            if (CommonFn.hasProperty(data, objProp)) {
              propCnt++;
            }
          }
        }


      });

      if (propCnt > 0) {
        let sql = '';
        let cnt = 0;
        let promiseChain: Promise<any> = Promise.resolve();
        let valueStr = '';
        let first = true;
        const valueArray: string[] = [];
        sql += 'UPDATE ' + table + ' SET ';

        schema.forEach(async (prop: schemaIfc) => {
          const skip = excludedField(prop);
          if (!skip && prop != undefined && prop.fieldName != 'id') {
            if (
              prop.excludeFromUpdate === undefined ||
              !prop.excludeFromUpdate  ||
              prop.fieldName === 'last_modified_date' ||
              prop.fieldName === 'last_modified_by' ||
              prop.fieldName === 'when_updated_usec' ||
              prop.fieldName === 'last_update_usec'
            ) {
              let addToUpdate = false;
              const objProp = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
              if (CommonFn.hasProperty(data, objProp)) {
                addToUpdate = true;
              } else {
                if (
                  prop.fieldName === 'last_modified_date' ||
                  prop.fieldName === 'last_modified_by' ||
                  prop.fieldName === 'when_updated_usec' ||
                  prop.fieldName === 'last_update_usec' ) {
                    addToUpdate = true;
                  }
              }
              if (addToUpdate) {
                promiseChain = promiseChain
                .then(async () => {
                  return await SqlFormatter.formatUpdateArray(
                    data,
                    objProp,
                    prop,
                    valueArray
                  );
                })
                .then(() => {
                  cnt++;
                  if (cnt >= propCnt) {
                    first = true;
                    valueArray.forEach((value: string) => {
                      if (first) {
                        first = false;
                      } else {
                        valueStr += ', ';
                      }
                      valueStr += value;
                    });
                    sql += valueStr;
                    resolve(sql);
                    return;
                  }
                })
                .catch((err) => {
                  throw err;
                });
              }
            }
          }
        });
      } else {
        resolve('');
      }
    });
  };


  /**
   * This function formats the SQL WHERE statement for conditions object by stringing the
   * condition properties with the opt (AND/OR)
   * @param whereSql - whereSql statement if plan function will expand WHERE statement
   * @param conditions - condition data object
   * @param schema - entity schema
   * @param opt - where statement AND/OR syntax
   */
  static formatWhere(
    whereSql: string,
    conditions: any,
    table: string,
    schema: schemaIfc[],
    opt: string,
    toCamelCase?: boolean
  ) {
    let sql = ' ';
    let first = true;
    if (whereSql.length === 0) {
      sql += 'WHERE ';
    } else {
      sql = whereSql;
    }

    for (const prop in conditions) {
      schema.some((fld) => {
        const fieldName = CommonFn.toSnakeCase(prop, toCamelCase);
        if (fld.fieldName === fieldName) {
          if (first) {
            first = false;
          } else {
            sql += ' ' + opt + ' ';
          }
          if (fld.uuidProperty) {
            sql += SqlStr.format(fld.fieldName + ' = UUID_TO_BIN(?)', [
              conditions[prop]
            ]);
          } else {
            const propValue = this.translateFldPropValue(fld.sqlType, conditions[prop]);
            sql += SqlStr.format(fld.fieldName + ' = ?', [propValue]);
          }
          return true;
        }
      });
    }

    return sql;
  }

  /**
   * This function formats the SQL WHERE conditions.prop1 = conditions.[prop1] AND conditions.prop2 = conditions.[prop2]
   * @param whereSql - beginning whereSql statement if blank then WHERE will be appended automatically
   * @param conditions - condition data object
   * @param schema - entity schema
   */
  static formatWhereAND(
    whereSql: string,
    conditions: any,
    table: string,
    schema: schemaIfc[]
  ) {
    return SqlFormatter.formatWhere(whereSql, conditions, table, schema, 'AND');
  }

  /**
   * This function formats the SQL WHERE conditions.prop1 = conditions.[prop1] OR conditions.prop2 = conditions.[prop2]
   * @param whereSql - beginning whereSql statement if blank then WHERE will be appended automatically
   * @param conditions - condition data object
   * @param schema - entity schema
   */
  static formatWhereOR(
    whereSql: string,
    conditions: any,
    table: string,
    schema: schemaIfc[]
  ) {
    return SqlFormatter.formatWhere(whereSql, conditions, table, schema, 'OR');
  }

  /**
   * This function format column name using table and column field name
   * eg 'tableName'.'fielName'
   * @param tableName - table name
   * @param fieldName - database column field name
   */
  static fmtTableFieldStr(tableName: string, fieldName: string) {
    const sql = tableName + '.' + fieldName;
    return sql;
  }

  static fmtLIKECondition(tableField: string, value: string) {
    const lowerCaseKeyword = value.toLowerCase();
    let condition = '';
    condition =
      'LOWER(' + tableField + ') LIKE ' + SqlStr.escape(lowerCaseKeyword + '%');
    return condition;
  }

  static fmtSetIsAliveIfExist(schema: schemaIfc[], isAlive: boolean): string | undefined {
    let setStmt;
    schema.some((fld: schemaIfc) => {

      if (fld.fieldName === 'is_alive') {
        if (isAlive) {
          setStmt = 'is_alive = 1'
        } else {
          setStmt = 'is_alive = 0'
        }
        return true;
      }
    })
    return setStmt;
  }


}

export default SqlFormatter;

function getFieldIdx(fieldValues: fieldValueIfc[], prop: schemaIfc): number {
  let fld = -1;

  fieldValues.some((fv, idx) => {
    if (prop.fieldName === fv.fieldName) {
      fld = idx;
      return true;
    }
  });
  return fld;
}




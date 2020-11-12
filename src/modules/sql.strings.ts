/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { schemaIfc } from './DbModule';
import { isString, isUndefined } from 'util';
// import { bcryptHash, cryptoStr } from './cryto';
import SqlStr = require('sqlstring');
import { bcryptHash, cryptoStr } from './cryto';
import CommonFn from './CommonFnModule';
import DTOGenerator from './ModelGenerator';
import SysLog from './SysLog';
/**
 * SqlFormatter Class
 * This class provide helper functions for formatting SQL syntax
 */
export class SqlFormatter {

  /**
   * This function format the data properties into stringed values and store it in the valueArray
   * @param obj -  data object
   * @param prop - schematic property
   * @param valueArray - return stringed property value array
   * @param addPropEqual - true to format : property = string property value eg `{prop.fieldName} = {data[prop.fieldName]}`
   *                     - false to format stringed property value only eg `{data[prop.fieldName]}
   */
  static formatValueArray = (
    obj: any,
    prop: schemaIfc,
    valueArray: string[],
    addPropEqual: boolean
  ): Promise<void> => {
    return new Promise((lresolve) => {
      if (prop.uuidProperty) {
        if (addPropEqual) {
          valueArray.push(prop.fieldName + ' = UUID_TO_BIN(@uuidId)');
        } else {
          valueArray.push('UUID_TO_BIN(@uuidId)');
        }
        lresolve();
      } else {
        if (isString(obj[prop.fieldName])) {
          if (
            !isUndefined(prop.encrypt) &&
            prop.encrypt &&
            !CommonFn.isEmpty(obj[prop.fieldName])
          ) {
            const escStrValue = obj[prop.fieldName];
            if (!isUndefined(prop.bcryptIt) && prop.bcryptIt) {
              bcryptHash(escStrValue).then((secret) => {
                if (addPropEqual) {
                  valueArray.push(prop.fieldName + ' = ' + SqlStr.escape(secret));
                } else {
                valueArray.push(SqlStr.escape(secret));
                }
                lresolve();
              });
            } else {
              cryptoStr(escStrValue).then((secret) => {
                if (addPropEqual) {
                  valueArray.push(prop.fieldName + ' = ' + SqlStr.escape(secret));
                } else {
                valueArray.push(SqlStr.escape(secret));
                }
                lresolve();
              });
            }
          } else {
            if (addPropEqual) {
              valueArray.push(prop.fieldName + ' = ' + SqlStr.escape(obj[prop.fieldName]));
            } else {
            valueArray.push(SqlStr.escape(obj[prop.fieldName]));
            }
            lresolve();
          }
        } else {
          if (addPropEqual) {
            valueArray.push(prop.fieldName + ' = ' + SqlStr.escape(obj[prop.fieldName]));
          } else {
          valueArray.push(SqlStr.escape(obj[prop.fieldName]));
          }
          lresolve();
        }
      }
    });
  };

  /**
   * This function formats the SQL INSERT syntax
   * @param obj - data object
   * @param table - table name
   * @param schema - table schema
   */
  static formatInsert = (
    obj: any,
    table: string,
    schema: schemaIfc[]
  ): Promise<string> => {
    return new Promise((resolve) => {
      let setStr = 'INSERT INTO ' + table + ' (';
      let valueStr = 'VALUES(';
      let sql = '';
      let first = true;
      const valueArray: string[] = [];

      let fldCnt = 0;
      schema.forEach(async (prop: schemaIfc) => {
        if (CommonFn.hasProperty(obj, prop.fieldName)) {
          if (first) {
            first = false;
          } else {
            setStr += ', ';
          }
          setStr += prop.fieldName;
          fldCnt++;
        }
      });

      let cnt = 0;
      let promiseChain: Promise<any> = Promise.resolve();
      schema.forEach(async (prop: schemaIfc) => {
        if (CommonFn.hasProperty(obj, prop.fieldName)) {
          promiseChain = promiseChain
            .then(async () => {
              return await SqlFormatter.formatValueArray(obj, prop, valueArray, false);
            })
            .then(() => {
              cnt++;
              if (cnt >= fldCnt) {
                let idx = 0;
                first = true;
                schema.forEach(async (prop: schemaIfc) => {
                  if (CommonFn.hasProperty(obj, prop.fieldName)) {
                    if (first) {
                      first = false;
                    } else {
                      valueStr += ', ';
                    }
                    valueStr += valueArray[idx++];
                  }
                });
                sql = setStr + ') ' + valueStr + ');';
                resolve(sql);
              }
            });
        }
      });
    });
  };

  /**
   * This function determines if properties are included in SQL statement based on fmtPropArr, function will return true
   * @param prop - schema property
   * @param fmtPropArr - prop fieldName array to include in SQL statement
   * @returns true/false
   */
  static includeInSql(prop: schemaIfc, fmtPropArr?: string[]): boolean {
    let includeInSql = false;
    if (!isUndefined(fmtPropArr) && fmtPropArr.length > 0) {
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
    if (!isUndefined(exclPropArr) && exclPropArr.length > 0) {
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
        if (isUndefined(prop.excludeFromSelect) || 
            ignoreExclFromSelect || 
            !prop.excludeFromSelect) {
          if (ignoreExclFromSelect || 
            SqlFormatter.includeInSql(prop, fmtPropArr)) {
            if (!isUndefined(prop.uuidProperty) && prop.uuidProperty) {
              if (first) {
                first = false;
              } else {
                sql += ', ';
              }
              sql += 'BIN_TO_UUID(' + prop.fieldName + ') ' + prop.fieldName;
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
   * This function formats the SQL UPDATE statement based on schema configuration and data object properties
   * it checks schema property excludeFromUpdate to determine if data property can be updated
   * @param table - entity table name
   * @param schema - entity schema
   * @param data - data object
   */
  static formatUpdate = (
    table: string,
    schema: schemaIfc[],
    data: any
  ): Promise<string> => {
    return new Promise((resolve) => {
      let propCnt = 0;

      for (const prop in data) {
        const colProp = DTOGenerator.getSchema(schema, prop);
        if (!isUndefined(colProp)) {
          if (isUndefined(colProp.excludeFromUpdate) || !colProp.excludeFromUpdate) {
            propCnt++;
          }
        }
      }


      if (propCnt > 0) {
        let sql = '';
        let cnt = 0;
        let promiseChain: Promise<any> = Promise.resolve();
        let valueStr = '';
        let first = true;
        const valueArray: string[] = [];
        sql += 'UPDATE ' + table + ' SET ';

        for (const prop in data) {
          const colProp = DTOGenerator.getSchema(schema, prop);
          if (!isUndefined(colProp)) {
            if (isUndefined(colProp.excludeFromUpdate) || !colProp.excludeFromUpdate) {
              promiseChain = promiseChain
              .then(async () => {
                return await SqlFormatter.formatValueArray(
                  data,
                  colProp,
                  valueArray,
                  true
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
                }
              });
            }
          }
        }
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
  static formatWhere(whereSql: string, conditions: any, schema: schemaIfc[], opt: string) {
    let sql = ' ';
    let first = true;
    if (whereSql.length === 0) {
      sql += 'WHERE ';
    } else {
      sql = whereSql;
    }

    for (const prop in conditions) {
      schema.some((fld) => {
        if (fld.fieldName === prop) {
          if (first) {
            first = false;
          } else {
            sql += ' ' + opt + ' ';
          }
          if (fld.uuidProperty) {
            sql += SqlStr.format(prop + ' = UUID_TO_BIN(?)', [
              conditions[prop]
            ]);
          } else {
            sql += SqlStr.format(prop + ' = ?', [conditions[prop]]);
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
  static formatWhereAND(whereSql: string, conditions: any, schema: schemaIfc[]) {
    return SqlFormatter.formatWhere(whereSql, conditions, schema, 'AND');
  }

  /**
   * This function formats the SQL WHERE conditions.prop1 = conditions.[prop1] OR conditions.prop2 = conditions.[prop2]
   * @param whereSql - beginning whereSql statement if blank then WHERE will be appended automatically
   * @param conditions - condition data object
   * @param schema - entity schema
   */
  static formatWhereOR(whereSql: string, conditions: any, schema: schemaIfc[]) {
    return SqlFormatter.formatWhere(whereSql, conditions, schema, 'OR');
  }
}

export default SqlFormatter;

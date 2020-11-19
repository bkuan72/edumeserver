/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonFn from './CommonFnModule'
import { sysTables } from '../schemas/SysTables';
import SysLog from './SysLog';
import mysqlx from 'mysqlx';
import Session from 'mysqlx/lib/Session';


export interface indexIfc {
    name: string;
    columns: string[];
    unique: boolean;
}
/**
 * Data column properties
 */
export interface schemaIfc  {
    fieldName: string;
    enum: string[];
    index: indexIfc[];
    postRequired?: boolean;
    trim?: boolean;
    primaryKey?: boolean;
    sqlType: string | undefined;
    size?: number;
    allowNull?: boolean;
    default?: string;
    encrypt?: boolean;
    bcryptIt?: boolean;
    excludeFromSelect?: boolean;
    excludeFromUpdate?: boolean;
    uuidProperty?: boolean;
}

export interface tableIfc {
    name: string;
    schema: schemaIfc[];
}

class Database {

    DB!: Session;

    serverCfg!: {
        host: string | undefined;
        user: string | undefined;
        password: string | undefined;
    };

    /**
     * connect the application to the MySQL database
     */
    DBM_connectDB = (): Promise<any> => {
        return new Promise ((resolve) => {
            const {
                DB_HOST,
                DB_USER,
                DB_PASSWORD,
                DB_NAME
              } = process.env;

              this.serverCfg = {
                  host: DB_HOST,
                  user: DB_USER,
                  password: DB_PASSWORD
              };

            mysqlx.getSession(this.serverCfg).then((session) => {
              this.DB = session;
              SysLog.info("Connected!");
              this.DBM_initializeDatabase(DB_NAME).then (() => {
                  resolve(this.DB);
              })
            })
            .catch((err: any) => {
                throw(err);
            });

        });
    }

    /**
     * This function query the database, it creates the database if not found, and if  data
     * table does not exist it creates the data tables
     * @param dbName - database name to initialize
     */
    DBM_initializeDatabase = (dbName: any): Promise<any> => {
        return new Promise ((resolve, reject) => {
            this.DB.sql("SHOW DATABASES LIKE " + CommonFn.strWrapper(dbName))
                .execute().then((result) => {
                    SysLog.info("Result: " + JSON.stringify(result));
                    if (result.rows.length === 0) {
                        this.DBM_createDb(dbName).then (() => {
                            this.DBM_selectDatabase(dbName).then (() => {
                                sysTables.forEach(table => {
                                    this.DBM_createTable(dbName, table.name, table.schema);
                                });
                                resolve();
                            })
                            .catch((err: any) => {
                                reject(err);
                            });
                        });
                    } else {
                        this.DBM_selectDatabase(dbName).then (() => {
                            sysTables.forEach(table => {
                                this.DBM_tableExistCheck(dbName, table);
                            });
                            resolve();
                        })
                        .catch((err: any) => {
                            reject(err);
                        })
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * This function query the database, and create the data table if does not exist
     * @param dbName - database name
     * @param table  - table object
     */
    DBM_tableExistCheck = (dbName: string, table: tableIfc): Promise<any | boolean> => {
        return new Promise((resolve, reject) => {
            let exist = false;
            this.DB.sql("SHOW TABLES LIKE " + CommonFn.strWrapper(table.name)).execute()
                .then((result) => {
                    if (result.rows.length === 0) {
                        SysLog.info("Table " + table.name + " Does Not Exist");
                        this.DBM_createTable (dbName, table.name, table.schema).then(()=> {
                            resolve(true);
                        })
                        .catch((err: any) => {
                            reject(err);
                        })
                    } else {
                        SysLog.info("Table : " + JSON.stringify(result))
                        exist = true;
                    }
                    resolve (exist);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }
    /**
     * This function execute the USE command for the database named
     * @param dbName - database name
     */
    DBM_selectDatabase = (dbName: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.DB.sql("USE " + dbName).execute()
            .then((result) => {
                SysLog.info("Database " + dbName + " Used " + JSON.stringify(result));
                resolve();
            })
            .catch((err) => {
                reject (err);
            });
        });
    }
    /**
     * This function check and create a database if it does not exist
     * @param dbName - database name to query
     */
    DBM_createDb = (dbName: string): Promise<any> => {
        return new Promise ((resolve, reject) => {
            this.DB.sql("CREATE DATABASE " + CommonFn.strWrapper(dbName)).execute()
            .then((result) => {
                SysLog.info("Database created " + JSON.stringify(result));
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
        })
    }
    /**
     * This function format a quoted coma delimited string list
     * @param sql - SQL buffer
     * @param arr - array of string values
     */
    appendStrList = (sql: string, arr: string[]) => {
        let ft = true;
        arr.forEach(enumVal => {
            if (ft) {
                ft = false;
            } else {
                sql += ",";
            }
            sql += "'" + enumVal + "'";
        });
        return sql;
    }

    /**
     * This function format the SQL syntax for and index property
     * @param sql - SQL buffer
     * @param index - index property
     */
    appendIdxColumnList = (sql: string, index: indexIfc) => {
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
    }
    /**
     * This function format the SQL syntax to create a database index
     * @param sql - the SQL string
     * @param indexes - index properties
     */
    appendIndexes = (sql: string, indexes: indexIfc[]) => {
        let first = true;
        indexes.forEach(index => {
            if (first) {
                first = false;
            } else {
                sql += "), "
            }
            sql += "INDEX "+ index.name + " (";
            sql = this.appendIdxColumnList (sql, index);
        });
        sql += ")";
        return sql;
    }


    /**
     * This function generate SQL to create a database table
     * @param db  - database name
     * @param tableName - name of table to create
     * @param tableProperties - table properties
     */
    DBM_createTable = (db: string, tableName: string, tableProperties: schemaIfc[]): Promise<void> => {
        return new Promise ((resolve, reject)=> {
            let sql = "CREATE TABLE `"+db+"`.`"+tableName+"` (";
            let first = true;

            tableProperties.forEach((field: schemaIfc) => {
                if (field.fieldName != 'INDEX') {
                    if (first) {
                        first = false;
                    } else {
                        sql += ", ";
                    }
                    for (const prop in field) {
                        let dropOut = false;
                        switch (prop) {
                            case 'fieldName':
                                sql += field[prop];
                                sql += ' ';
                                break;
                            case 'sqlType':
                                sql += field[prop];
                                if (field.primaryKey) {
                                    dropOut = true;
                                }
                                break;
                            case 'allowNull':
                                sql += " ";
                                if (field[prop] == true) {
                                    sql += 'NULL'
                                } else {
                                    sql += 'NOT NULL'
                                }
                                break;
                            case 'default':
                                if (field.sqlType?.includes('VARCHAR')) {
                                    sql += " ";
                                    sql += "DEFAULT '"+ field[prop];
                                    sql += "'";
                                } else {
                                    sql += " ";
                                    sql += "DEFAULT '"+ field[prop]?.toString();
                                    sql += "'";
                                }
                                break;
                            case 'enum':
                                if (field.sqlType?.includes('ENUM')) {
                                    sql += "("
                                    sql = this.appendStrList (sql, field.enum);
                                    sql += ")";
                                }
                                break;
                        }
                        if (dropOut) {
                            break;
                        }
                    }
                }
            })

            tableProperties.forEach((field: schemaIfc) => {
                if (field.fieldName == 'INDEX') {
                sql += ", ";
                if (field.index.length > 0) {
                    sql = this.appendIndexes (sql, field.index);
                }
                }
            })

            sql += ")";
            SysLog.info("Create Table : " + sql);
            this.DB.sql(sql).execute()
            .then((result) => {
                SysLog.info("Table created : " + JSON.stringify(result));
                resolve();
            })
            .catch((err) => {
                console.log ('Create Table Error :', err)
                reject(err);
            });
        });

    }

}



const dbConnection = new Database ();

export default dbConnection;

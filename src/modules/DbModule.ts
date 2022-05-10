import mysqlx from 'mysqlx';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonFn from './CommonFnModule';
import { sysTables } from '../schemas/SysTables';
import SysLog from './SysLog';
import SqlFormatter from './sql.strings';
import Session from 'mysqlx/lib/Session';

export interface indexIfc {
  name: string;
  columns: string[];
  unique: boolean;
}
/**
 * Data column properties
 */
export interface schemaIfc {
  fieldName: string; // SQL column name
  sqlType: string | undefined; // sql type eg VARCHAR, BLOB, INT, ENUM, TEXT, etc
  size?: number; // size of VARCHAR
  allowNull?: boolean; // allow null value
  default?: string | number; // default value
  enum?: string[]; // ENUM values
  index?: indexIfc[]; // array of index

  primaryKey?: boolean; // is a primary key
  trim?: boolean; // right trim the String
  encrypt?: boolean; // encrypted value
  bcryptIt?: boolean; // using bcrypt
  postRequired?: boolean; // column required for INSERT SQL statement
  excludeFromSelect?: boolean; // exclude column from SELECT SQL statement
  excludeFromUpdate?: boolean; // exclude column from UPDATE SQL statement
  uuidProperty?: boolean; // a UUID field

  description?: string; // description of the field
}

export interface tableIfc {
  name: string;
  schema: schemaIfc[];
}

class Database {

  serverCfg!: {
    host: string | undefined;
    user: string | undefined;
    password: string | undefined;
  };

  /**
   * This function execute the USE command for the database named
   * @param session - DB session
   * @param dbName - database name
   */
  DBM_selectSessionDB = (session: Session, dbName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      session
        .sql('USE ' + dbName + ';')
        .execute()
        .then((result) => {
          SysLog.info('Database ' + dbName + ' Used ' + JSON.stringify(result));
          resolve(undefined);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  /**
   * connect the application to the MySQL database to get new session
   * - use this for INSERT/PUT/PATCH data
   * NOTE *** Remember to close the session after user - ie. session.close();
   */
  DBM_newDBSession = (selectDB?: boolean): Promise<Session> => {
    return new Promise((resolve) => {
      const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

      this.serverCfg = {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD
      };
      let dbName = 'ls10_net';
      if (DB_NAME != undefined) {
        dbName = DB_NAME;
      }
      SysLog.info('host: ' + this.serverCfg.host);
      SysLog.info('user: ' + this.serverCfg.user);
      // SysLog.info('password: ' + this.serverCfg.password);
      // SysLog.info("port: " + this.serverCfg.port);
      mysqlx
        .getSession(this.serverCfg)
        .then((session) => {
          SysLog.info('Connected!');
          if (selectDB === undefined || selectDB === true) {
            this.DBM_selectSessionDB(session, dbName)
            .then(() => {
              resolve(session);
              return;
            })
            .catch((err: any) => {
              throw err;
              return;
            });
          }
          resolve(session);
          return;
        })
        .catch((err: any) => {
          throw err;
        });
    });
  };

  /**
   * connect the application to the MySQL database
   */
  DBM_initSysTableSchema = (): Promise<void> => {
    return new Promise((resolve) => {
      const {DB_NAME } = process.env;
      let dbName = 'ls10_net';
      if (DB_NAME != undefined) {
        dbName = DB_NAME;
      }


      this.DBM_newDBSession(false)
          .then((session) => {
            SysLog.info('Connected!');
            this.DBM_initializeDatabase(dbName, session)
              .then(() => {
                session.getXSession().close();
                resolve();
              })
              .catch((err: any) => {
                session.getXSession().close();
                throw err;
              });
          })
          .catch((err: any) => {
            throw err;
          });
    });
  };

  /**
   * This function query the database, it creates the database if not found, and if  data
   * table does not exist it creates the data tables
   * @param dbName - database name to initialize
   */
  DBM_initializeDatabase = (dbName: string, session: Session): Promise<any> => {
    return new Promise((resolve, reject) => {
      session.sql('SHOW DATABASES LIKE ' + CommonFn.strWrapper(dbName) + ';')
        .execute()
        .then((result) => {
          SysLog.info('Result: ' + JSON.stringify(result));
          if (result.rows.length === 0) {
            this.DBM_createDb(dbName, session)
              .then(() => {
                this.DBM_selectDatabase(dbName, session)
                  .then(() => {
                    sysTables.forEach((table) => {
                      this.DBM_createTable(dbName, table.name, table.schema);
                    });
                    resolve(undefined);
                  })
                  .catch((err: any) => {
                    reject(err);
                  });
              })
              .catch((err) => {
                throw err;
              });
          } else {
            this.DBM_selectDatabase(dbName, session)
              .then(() => {
                sysTables.forEach((table) => {
                  this.DBM_tableExistCheck(dbName, table, session).finally(() => {
                    resolve(undefined);
                  });
                });
              })
              .catch((err: any) => {
                reject(err);
              });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  /**
   * Check and update table schema if there is missing fields in the database table
   * @param dbName database schema name
   * @param table table name
   * @returns
   */
  DBM_tableSchemaUpdate = (
    dbName: string,
    table: tableIfc
  ): Promise<any | boolean> => {
    return new Promise((resolve, reject) => {
      const columns: string[] = [
        'column_name',
        'column_default',
        'data_type',
        'column_type'
      ];
      let colStr = '';
      columns.forEach((col) => {
        if (colStr !== '') {
          colStr += ', ' + col;
        } else {
          colStr = col;
        }
      });

      this.DBM_newDBSession().then((session) => {
        session.sql(
          'SELECT ' +
            colStr +
            ' FROM INFORMATION_SCHEMA.COLUMNS' +
            ' WHERE TABLE_SCHEMA = ' +
            CommonFn.strWrapper(dbName) +
            ' AND TABLE_NAME = ' +
            CommonFn.strWrapper(table.name) +
            ';'
        )
          .execute()
          .then((result) => {
            SysLog.info('Table : ' + JSON.stringify(result));
            const colDefinitions: any[] = [];
            result.rows.forEach((data) => {
              colDefinitions.push(
                SqlFormatter.transposeColumnResultSet(columns, data)
              );
            });
            let alterSql = '';
            table.schema.forEach((column: schemaIfc) => {
              if (column.fieldName !== 'INDEX') {
                let newCol = true;
                colDefinitions.some((colDef) => {
                  if (column.fieldName === colDef.column_name) {
                    newCol = false;
                    // TODO logic to alter existing columns
                    // if (alterSql === '') {
                    //     alterSql = 'ALTER TABLE ' + table.name;
                    // } else {
                    //     alterSql += ', '
                    // }
                    return true;
                  }
                });
                if (newCol) {
                  if (alterSql === '') {
                    alterSql = 'ALTER TABLE ' + table.name;
                  } else {
                    alterSql += ', ';
                  }
                  alterSql +=
                    ' ADD COLUMN ' +
                    SqlFormatter.formatColumnDefinition(table.name, column);
                }
              }
            });
            if (alterSql !== '') {
              alterSql += ';';
              session.sql(alterSql)
                .execute()
                .then((result) => {
                  session.getXSession().close();

                  SysLog.info(
                    'Success Altering Table Schema : ' + JSON.stringify(result)
                  );
                  resolve(true);
                })
                .catch((err) => {
                  session.getXSession().close();
                  SysLog.error(
                    'Error Altering Table Schema : ' + JSON.stringify(err)
                  );
                  reject(err);
                });
            } else {
              session.getXSession().close();
              resolve(false);
            }
          })
          .catch((err) => {
            SysLog.error('Error Reading Table Schema : ' + JSON.stringify(err));
            session.getXSession().close();
            reject(err);
          });
      }).catch((err) => {
        SysLog.error('Error getNewDbSession : ' + JSON.stringify(err));
        reject(err);
      });

    });
  };

  /**
   * This function query the database, and create the data table if does not exist
   * @param dbName - database name
   * @param table  - table object
   */
  DBM_tableExistCheck = (
    dbName: string,
    table: tableIfc,
    session: Session
  ): Promise<any | boolean> => {
    return new Promise((resolve, reject) => {
      let exist = false;
      session.sql('SHOW TABLES LIKE ' + CommonFn.strWrapper(table.name) + ';')
        .execute()
        .then((result) => {
          if (result.rows.length === 0) {
            SysLog.info('Table ' + table.name + ' Does Not Exist');
            this.DBM_createTable(dbName, table.name, table.schema)
              .then(() => {
                resolve(true);
              })
              .catch((err: any) => {
                reject(err);
              });
          } else {
            this.DBM_tableSchemaUpdate(dbName, table)
              .then((alter) => {
                exist = true;
                SysLog.info('Table Altered : ' + alter);
                resolve(exist);
              })
              .catch((err) => {
                reject(err);
              });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  /**
   * This function execute the USE command for the database named
   * @param dbName - database name
   */
  DBM_selectDatabase = (dbName: string, session: Session): Promise<any> => {
    return new Promise((resolve, reject) => {
      session.sql('USE ' + dbName + ';')
        .execute()
        .then((result) => {
          SysLog.info('Database ' + dbName + ' Used ' + JSON.stringify(result));
          resolve(undefined);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  /**
   * This function check and create a database if it does not exist
   * @param dbName - database name to query
   */
  DBM_createDb = (dbName: string, session: Session): Promise<any> => {
    return new Promise((resolve, reject) => {
      const sql = 'CREATE DATABASE ' + dbName + ';';
      session.sql(sql + ';')
        .execute()
        .then((result) => {
          SysLog.info('Database created ' + JSON.stringify(result));
          resolve(undefined);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  /**
   * Create table index
   * @param prom  promise to resolve after task complete
   * @param dbName database schema name
   * @param tableName table name
   * @param index index interface object
   * @returns
   */
  DBM_createIndex = (
    prom: Promise<any>,
    dbName: string,
    tableName: string,
    index: indexIfc
  ): Promise<any | undefined> => {
    let sql = '';
    return new Promise((resolve, reject) => {
      this.DBM_newDBSession().then((session) => {
        if (prom == undefined) {
          sql = SqlFormatter.formatCreateIndexSql(dbName, tableName, index);
          SysLog.info('Create Index : ' + sql);
          session.sql(sql + ';')
            .execute()
            .then((result) => {
              session.getXSession().close();
              SysLog.info('Index created : ' + JSON.stringify(result));
              resolve(undefined);
            })
            .catch((err) => {
              session.getXSession().close();

              SysLog.error('Create Index SQL : ' + sql);
              SysLog.error('Create Index Error :', err);
              reject(err);
            });
        } else {
          prom
            .then(() => {
              sql = SqlFormatter.formatCreateIndexSql(dbName, tableName, index);
              SysLog.info('Create Index : ' + sql);
              session.sql(sql + ';')
                .execute()
                .then((result) => {
                  session.getXSession().close();

                  SysLog.info('Index created : ' + JSON.stringify(result));
                  resolve(undefined);
                })
                .catch((err) => {
                  session.getXSession().close();

                  SysLog.error('Create Index SQL : ' + sql);
                  SysLog.error('Create Index Error :', err);
                  reject(err);
                });
            })
            .catch((err) => {
              SysLog.error('Create Index SQL : ' + sql);
              SysLog.error('Create Index Error :', err);
              reject(err);
            });
        }
      }).catch((err) => {
        SysLog.error('Error getNewDbSession :', err);
        reject(err);
      });

    });
  };

  /**
   * This function generate SQL to create a database table
   * @param db  - database name
   * @param tableName - name of table to create
   * @param tableProperties - table properties
   */
  DBM_createTable = (
    db: string,
    tableName: string,
    tableProperties: schemaIfc[]
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      let sql = 'CREATE TABLE `' + db + '`.`' + tableName + '` (';
      let first = true;

      tableProperties.forEach((column) => {
        if (column.fieldName !== 'INDEX') {
          if (first) {
            first = false;
          } else {
            sql += ', ';
          }
          sql += SqlFormatter.formatColumnDefinition(tableName, column);
        }
      });

      sql += ');';

      SysLog.info('Create Table : ' + sql);
      this.DBM_newDBSession().then((session) => {
        session.sql(sql + ';')
        .execute()
        .then((result) => {
          SysLog.info('Table created : ' + JSON.stringify(result));
          sql = '';
          tableProperties.forEach((column: schemaIfc) => {
            if (column.fieldName == 'INDEX') {
              let prom: Promise<any>;
              if (column.index) {
                if (column.index.length > 0) {
                  column.index.forEach((idx: indexIfc) => {
                    prom = this.DBM_createIndex(prom, db, tableName, idx);
                  });
                }
              }
            }
          });
          session.getXSession().close()
          resolve();
        })
        .catch((err) => {
          SysLog.error('Create Table SQL : ' + sql);
          SysLog.error('Create Table Error :', err);
          session.getXSession().close();
          reject(err);
        });
      }) .catch((err) => {
        SysLog.error('Error getNewDBSession :', err);
        reject(err);
      });
    });
  };
}

const dbConnection = new Database();

export default dbConnection;

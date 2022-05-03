/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Session from 'mysqlx/lib/Session';
import {
  ServerDefaultProperties,
  ServerPropertyTypeEnum
} from '../config/server.default.properties';
import SysEnv from './SysEnv';
import dbConnection from './DbModule';
import { PropertyService } from '../services/property.service';
import { Metadata } from 'mysqlx';
import SysLog from './SysLog';
import { uuidIfc } from '../interfaces/uuidIfc';

export class AppDbModule {
  dbConnection = dbConnection;
  properties = new PropertyService();
  propertiesRetry = true;

  serverCfg!: {
    host: string | undefined;
    user: string | undefined;
    password: string | undefined;
  };

  public getNewDbSession(): Promise<Session> {
    return new Promise((resolve) => {
      dbConnection.DBM_newDBSession().then((session) => {
        resolve(session);
      });
    });
  }

  public initializeModuleDB(): Promise<void> {
    return new Promise((resolve) => {
      this.dbConnection.DBM_initSysTableSchema().then(() => {
        if (this.propertiesRetry) {
          this.propertiesRetry = false;
          this.createDefaultProperties().finally(() => {
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  private createDefaultProperties(): Promise<void> {
    return new Promise<void>((resolve) => {
      const createProperty = (
        res: (value: void | PromiseLike<void>) => void,
        idx: number
      ): void => {
        if (this.propertiesRetry === false) {
          res();
          return;
        }
        if (idx >= ServerDefaultProperties.length) {
          this.propertiesRetry = false;
          res();
        } else {
          const prop = ServerDefaultProperties[idx];
          const propName = SysEnv.SITE_CODE + '.' + prop.name;
          const newProperty = {
            name: '',
            property_type: '',
            value: '',
            numValue: 0
          };
          newProperty.name = propName;
          switch (prop.type) {
            case ServerPropertyTypeEnum.INT:
              if (prop.numValue) {
                newProperty.numValue = prop.numValue;
              }
              newProperty.property_type = 'INT';
              break;
            case ServerPropertyTypeEnum.TEXT:
              if (prop.value) {
                newProperty.value = prop.value;
              }
              newProperty.property_type = 'TEXT';
              break;
          }
          this.properties
            .getProperty(newProperty)
            .then((propertyDTO) => {
              if (propertyDTO.length > 0) {
                ServerDefaultProperties[idx].numValue = propertyDTO[0].numValue;
                ServerDefaultProperties[idx].value = propertyDTO[0].value;
              }
              createProperty(res, idx + 1);
            })
            .catch(() => {
              this.propertiesRetry = true;
              res();
            });
        }
      };
      createProperty(resolve, 0);
    });
  }



  private startTransaction(
    lsession: Session | undefined,
    startTransaction: boolean | undefined
  ): Promise<boolean> {
    if ((startTransaction == undefined || startTransaction) && lsession) {
      return lsession.startTransaction();
    }
    return new Promise((resolve) => resolve(true));
  }
  private commit(
    lsession: Session | undefined,
    startTransaction: boolean | undefined
  ): Promise<boolean> {
    if ((startTransaction == undefined || startTransaction) && lsession) {
      return lsession.commit();
    }
    return new Promise((resolve) => resolve(true));
  }

  private rollback(
    lsession: Session | undefined,
    startTransaction: boolean | undefined
  ): Promise<boolean> {
    if ((startTransaction == undefined || startTransaction) && lsession) {
      return lsession.rollback();
    }
    return new Promise((resolve) => resolve(true));
  }

  /**
   * INSERT data operation
   *
   * @param {string} sql - formatted SQL statement
   * @param {Session} [session] - if defined function will not terminate session
   * @return {*}  {Promise<string>} - resolve with UUID
   * @memberof AppDbModule
   */
  public async insert(
    sql: string,
    session?: Session,
    transactionCommit?: boolean
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getSession(session).then((res) => {
        this.startTransaction(session, transactionCommit)
          .then(() => {
            res.DBSession.sql('SET @uuidId=UUID(); ')
              .execute()
              .then((_result) => {
                res.DBSession.sql(sql + ';')
                  .execute()
                  .then((_result2) => {
                    res.DBSession.sql('SELECT @uuidId;')
                      .execute()
                      .then((result3) => {
                        this.commit(session, transactionCommit)
                          .then((success) => {
                            if (success) {
                              SysLog.info('created Entity: ', result3);
                              const newUuid: uuidIfc = {
                                '@uuidId': result3.rows[0][0]
                              }; // TODO

                              if (res.autoCloseSession)
                                this.close(res.DBSession);
                              resolve(newUuid['@uuidId']);
                            } else {
                              SysLog.info('SQL : '+sql);
                              SysLog.error('Failed Committing data');
                              if (res.autoCloseSession)
                                this.close(res.DBSession);
                              reject(undefined);
                            }
                          })
                          .catch(() => {
                            SysLog.info('SQL : '+sql);
                            SysLog.error('Failed Committing Data');
                            if (res.autoCloseSession) this.close(res.DBSession);
                            reject(undefined);
                          });
                      })
                      .catch((err) => {
                        SysLog.info('SQL : '+sql);
                        SysLog.error(JSON.stringify(err));
                        if (res.autoCloseSession) this.close(res.DBSession);
                        reject(undefined);
                        return;
                      });
                  })
                  .catch((err) => {
                    SysLog.info('SQL : '+sql);
                    SysLog.error(JSON.stringify(err));
                    if (res.autoCloseSession) this.close(res.DBSession);
                    reject(undefined);
                    return;
                  });
              })
              .catch((err) => {
                SysLog.info('SQL : '+sql);
                SysLog.error(JSON.stringify(err));
                if (res.autoCloseSession) this.close(res.DBSession);
                reject(undefined);
                return;
              });
          })
          .catch(() => {
            SysLog.error('Failed Starting SQL transaction');
            if (res.autoCloseSession) this.close(res.DBSession);
            reject(undefined);
          });
      });
    });
  }

  /**
   * Close session
   * @param DBSession - DB session to be closed
   */
  public close(DBSession: Session) {
    DBSession.getXSession().close();
  }

  /**
   *  This function determine if session is to be created.
   * if session is passed in then it will set the autoCloseSession to false
   *
   * @public
   * @param {(Session | undefined)} session - if session is undefine this function will get new DB session
   * @memberof AppDbModule
   */
  public getSession(
    session: Session | undefined
  ): Promise<{ DBSession: Session; autoCloseSession: boolean }> {
    return new Promise((resolve, reject) => {
      if (session) {
        const DBSession: Session = session;
        const autoCloseSession = false;
        resolve({ DBSession, autoCloseSession });
        return;
      } else {
        this.getNewDbSession()
          .then((DBSession: Session) => {
            const autoCloseSession = true;
            resolve({ DBSession, autoCloseSession });
          })
          .catch(() => {
            SysLog.error('Failed getting SQL session');
            reject(undefined);
            return;
          });
      }
    });
  }

  /**
   *  UPDATE data operation for a Single Transaction
   *
   * @param {string} sql - update sql to be executed
   * @param {Session} [session] - Optional DB session if define session would NOT be closed automatically
   * @return {*}
   * @memberof AppDbModule
   */
  public update(sql: string, session?: Session, transactionCommit?: boolean) {
    return new Promise<{
      rows: any[][];
      metadata: Metadata;
    }>((resolve, reject) => {
      this.getSession(session).then((res) => {
        this.startTransaction(session, transactionCommit)
          .then(() => {
            res.DBSession.sql(sql + ';')
              .execute()
              .then((result: { rows: any[][]; metadata: Metadata }) => {
                this.commit(session, transactionCommit)
                  .then((success: boolean) => {
                    if (success) {
                      if (res.autoCloseSession) this.close(res.DBSession);
                      resolve(result);
                    } else {
                      SysLog.info('SQL : '+sql);
                      SysLog.error('Failed Committing Data');
                      if (res.autoCloseSession) this.close(res.DBSession);
                      reject();
                    }
                  })
                  .catch(() => {
                    SysLog.info('SQL : '+sql);
                    SysLog.error('Failed Committing Data');
                    if (res.autoCloseSession) this.close(res.DBSession);
                    reject();
                  });
              })
              .catch((err) => {
                SysLog.info('SQL : '+sql);
                SysLog.error(JSON.stringify(err));
                if (res.autoCloseSession) this.close(res.DBSession);
                reject();
                return;
              });
          })
          .catch(() => {
            SysLog.error('Failed Starting SQL transaction');
            if (res.autoCloseSession) this.close(res.DBSession);
            reject();
          });
      });
    });
  }

  /**
   *  SELECT data operation
   *
   * @param {string} sql - select sql to be executed
   * @param {Session} [session] - Optional DB session if define session would NOT be closed automatically
   * @return {*}
   * @memberof AppDbModule
   */
  public select(sql: string, session?: Session) {
    return new Promise<{
      rows: any[][];
      metadata: Metadata;
    }>((resolve, reject) => {
      this.getSession(session).then((res) => {

        res.DBSession.sql(sql + ';')
          .execute()
          .then((result: { rows: any[][]; metadata: Metadata }) => {
            if (res.autoCloseSession) this.close(res.DBSession);
            SysLog.info('Rows Found: ' + result.rows.length.toString());
            resolve(result);
          })
          .catch((err) => {
            SysLog.info('SQL : '+sql);
            SysLog.error(JSON.stringify(err));
            if (res.autoCloseSession) this.close(res.DBSession);
            reject(err);
            return;
          });
      });
    });
  }
}

const appDbConnection = new AppDbModule();

export default appDbConnection;

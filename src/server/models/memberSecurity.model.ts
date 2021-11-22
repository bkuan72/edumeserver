/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MemberSecurityDTO } from '../../dtos/memberSecurities.DTO';
import SqlFormatter from '../../modules/sql.strings';
import { member_security_schema, member_security_schema_table } from '../../schemas/memberSecurities.schema';
import { EntityModel } from './entity.model';
import SysLog from '../../modules/SysLog';
import SqlStr = require('sqlstring');
import appDbConnection from '../../modules/AppDBModule';

export class MemberSecurityModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = member_security_schema_table;
    }
    this.requestDTO = MemberSecurityDTO;
    this.responseDTO = MemberSecurityDTO;
    this.schema = member_security_schema;
  }

  /**
   * Find the member security using accountGroupMember.id
   * @param memberId - member id
   * @returns 
   */
   findByMemberId = (memberId: string): Promise<any> => {
    return new Promise((resolve) => {
      let resMemberSecurityDTO = new MemberSecurityDTO();
      let sql =
        SqlFormatter.formatSelect(this.tableName, this.schema) + ' WHERE ';
      sql += SqlStr.format('site_code = ?', [this.siteCode]) + ' AND ';
      sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
      sql += SqlStr.format('member_id = UUID_TO_BIN(?)', [memberId]);
      SysLog.info('findById SQL: ' + sql);
      appDbConnection.connectDB().then((DBSession) => {
      DBSession.sql(sql)
        .execute()
        .then((result) => {
          if (result.rows.length) {
            result.rows.forEach((rowData) => {
              const data = SqlFormatter.transposeResultSet(
                this.schema,
                undefined,
                undefined,
                rowData
              );
              resMemberSecurityDTO = new this.responseDTO(data) as MemberSecurityDTO;
            });
            resolve(resMemberSecurityDTO);
            return;
          }
          // not found Customer with the id
          resolve(resMemberSecurityDTO);
        })
        .catch((err) => {
          SysLog.error(JSON.stringify(err));
          resolve(resMemberSecurityDTO);
          return;
        });
      });

    });
  };
}
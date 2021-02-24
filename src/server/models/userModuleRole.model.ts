import { UserModuleRoleDataDTO } from './../../dtos/userModuleRoles.DTO';
import { roles_schema, roles_schema_table } from './../../schemas/roles.schema';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UserModuleRoleDTO } from '../../dtos/userModuleRoles.DTO';
import SqlFormatter from '../../modules/sql.strings';
import SqlStr = require('sqlstring');
import { UserModuleRoleData, userModuleRoles_schema, userModuleRoles_schema_table } from '../../schemas/userModuleRoles.schema';
import { EntityModel } from './entity.model';
import dbConnection from '../../modules/DbModule';
import SysLog from '../../modules/SysLog';
import { modules_schema, modules_schema_table } from '../../schemas/modules.schema';

export class UserModuleRoleModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = userModuleRoles_schema_table;
    }
    this.requestDTO = UserModuleRoleDTO;
    this.responseDTO = UserModuleRoleDTO;
    this.schema = userModuleRoles_schema;
  }

  getUserModuleRoles = async (siteCode: string, userId: string): Promise<UserModuleRoleDataDTO[]> => {
    return new Promise((resolve) => {
      const excludeColumns = [
        'id',
        'lastUpdateUsec',
        'status',
        'site_code'
      ];
      const userModuleRoles: UserModuleRoleDataDTO[] = [];
      let sql = 'SELECT ' + SqlFormatter.formatTableSelect(roles_schema_table,
                              roles_schema,
                              excludeColumns);
      sql += ', ' + SqlFormatter.formatTableSelect(modules_schema_table,
                                                   modules_schema,
                                                   excludeColumns);
      sql += ', ' + SqlFormatter.formatTableSelect(userModuleRoles_schema_table,
                                                   userModuleRoles_schema,
                                                   excludeColumns);
      sql += ' FROM '+ userModuleRoles_schema_table;
      sql += ' INNER JOIN ' + roles_schema_table + ' ON ' + userModuleRoles_schema_table + '.role_id = ' + roles_schema_table + '.id'
      sql += ' INNER JOIN ' + modules_schema_table + ' ON ' + userModuleRoles_schema_table + '.module_id = ' + modules_schema_table + '.id'
      sql += ' WHERE ' + userModuleRoles_schema_table+ '.site_code = ' + SqlStr.escape(siteCode) + ' AND ';
      sql += SqlStr.format(userModuleRoles_schema_table+ '.user_id = UUID_TO_BIN(?);', [userId]);
      dbConnection.DB.sql(sql).execute()
      .then((result) => {
        if (result.rows.length == 0) {
          // not found Customer with the id
          resolve(userModuleRoles);
          return;
        }
        SysLog.info('get user accounts with id: ', userId);
        result.rows.forEach(rowData => {
          const userModuleRoleDTO = new UserModuleRoleDataDTO() as UserModuleRoleData
          let colIdx = 0;
          colIdx = SqlFormatter.transposeTableSelectColumns(colIdx,
                                                            userModuleRoleDTO.role,
                                                            roles_schema,
                                                            rowData,
                                                            excludeColumns
                                                            );
          colIdx = SqlFormatter.transposeTableSelectColumns(colIdx,
                                                              userModuleRoleDTO.module,
                                                              modules_schema,
                                                              rowData,
                                                              excludeColumns);
          colIdx = SqlFormatter.transposeTableSelectColumns(colIdx,
                                                              userModuleRoleDTO,
                                                              userModuleRoles_schema,
                                                              rowData,
                                                              excludeColumns);
          userModuleRoles.push(userModuleRoleDTO);
        });
        resolve(userModuleRoles);
      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(userModuleRoles);
        return;
      });
    });
  };
}
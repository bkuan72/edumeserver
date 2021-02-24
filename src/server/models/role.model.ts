/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RoleDTO } from '../../dtos/roles.DTO';
import { roles_schema, roles_schema_table } from '../../schemas/roles.schema';
import { EntityModel } from './entity.model';

export class RoleModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = roles_schema_table;
    }
    this.requestDTO = RoleDTO;
    this.responseDTO = RoleDTO;
    this.schema = roles_schema;
  }
}
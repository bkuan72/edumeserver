/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ModuleDTO } from '../../dtos/modules.DTO';
import { modules_schema, modules_schema_table } from '../../schemas/modules.schema';
import { EntityModel } from './entity.model';

export class ModuleModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = modules_schema_table;
    }
    this.requestDTO = ModuleDTO;
    this.responseDTO = ModuleDTO;
    this.schema = modules_schema;
  }
}
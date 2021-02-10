/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AdAgeGroupDTO } from '../../dtos/adAgeGroups.DTO';
import { adAgeGroups_schema, adAgeGroups_schema_table } from '../../schemas/adAgeGroups.schema';
import { EntityModel } from './entity.model';

export class AdAgeGroupModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = adAgeGroups_schema_table;
    }
    this.requestDTO = AdAgeGroupDTO;
    this.responseDTO = AdAgeGroupDTO;
    this.schema = adAgeGroups_schema;
  }
}
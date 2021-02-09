import { AdActivityDTO } from './../../dtos/adActivities.DTO';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { adActivities_schema, adActivities_schema_table } from '../../schemas/adActivities.schema';
import { EntityModel } from './entity.model';

export class AdActivityModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = adActivities_schema_table;
    }
    this.requestDTO = AdActivityDTO;
    this.responseDTO = AdActivityDTO;
    this.schema = adActivities_schema;
  }
}
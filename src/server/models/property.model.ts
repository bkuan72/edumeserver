/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { properties_schema, properties_schema_table } from '../../schemas/properties.schema';
import { PropertyDTO } from '../../dtos/properties.DTO';
import { EntityModel } from './entity.model';

export class PropertyModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = properties_schema_table;
    }
    this.requestDTO = PropertyDTO;
    this.responseDTO = PropertyDTO;
    this.schema = properties_schema;
  }
}

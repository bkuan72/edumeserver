/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AdCategoryDTO } from '../../dtos/AdCategories.DTO';
import { adCategories_schema, adCategories_schema_table } from '../../schemas/adCategories.schema';
import { EntityModel } from './entity.model';

export class AdCategoryModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = adCategories_schema_table;
    }
    this.requestDTO = AdCategoryDTO;
    this.responseDTO = AdCategoryDTO;
    this.schema = adCategories_schema;
  }
}
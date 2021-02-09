/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AdKeywordDTO } from '../../dtos/adKeywords.DTO';
import { adKeywords_schema, adKeywords_schema_table } from '../../schemas/adKeywords.schema';
import { EntityModel } from './entity.model';

export class AdKeywordModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = adKeywords_schema_table;
    }
    this.requestDTO = AdKeywordDTO;
    this.responseDTO = AdKeywordDTO;
    this.schema = adKeywords_schema;
  }
}
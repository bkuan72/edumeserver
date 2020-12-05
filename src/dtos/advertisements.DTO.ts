/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AdvertisementData, advertisements_schema } from '../schemas/advertisements.schema';


export class AdvertisementDTO {
  data: AdvertisementData;
  constructor(advertisementData?: any) {
    this.data = DTOGenerator.genSchemaModel(advertisements_schema);
    if (!CommonFn.isUndefined(advertisementData)) {
      for (const prop in advertisementData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = advertisementData[prop];
        }
      }
    }
  }
}
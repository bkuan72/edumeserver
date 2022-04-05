/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AdvertisementData, advertisements_schema } from '../schemas/advertisements.schema';


export class AdvertisementDTO {
  data: AdvertisementData;
  constructor(advertisementData?: any) {
    DTOGenerator.genDTOFromSchema(this, advertisements_schema, undefined, advertisementData);
    if (!CommonFn.isUndefined(advertisementData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(advertisementData, prop)) {
          this[prop] = advertisementData[prop];
        }
      }
    }
  }
}


export class UpdAdvertisementDTO {
  data: AdvertisementData;
  constructor(advertisementData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, advertisements_schema, undefined, advertisementData);
    if (!CommonFn.isUndefined(advertisementData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(advertisementData, prop)) {
          this[prop] = advertisementData[prop];
        }
      }
    }
  }
}
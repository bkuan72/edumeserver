/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { MemberSecurityData, member_security_schema } from '../schemas/memberSecurities.schema';


export class MemberSecurityDTO {
   // data: MemberSecurityData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, member_security_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdMemberSecurityDTO {
   // data: MemberSecurityData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, member_security_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}
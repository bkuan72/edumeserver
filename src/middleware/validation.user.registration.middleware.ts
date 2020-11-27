/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import DTOGenerator from '../modules/ModelGenerator';
import { schemaIfc } from '../modules/DbModule';
import CommonFn from '../modules/CommonFnModule';
import SysLog from '../modules/SysLog';
 
function validationUserRegistrationMiddleware<T>(dto_schema: schemaIfc[]): express.RequestHandler {
  return (req, res, next) => {
    let errors = DTOGenerator.validateCreateDTOSchema({schema: dto_schema, postDTO: req.body});
    if (errors) {
      SysLog.error(errors);
        next(new HttpException(400, errors));
    } else {
      if (CommonFn.isEmpty(req.body.email)) {
        errors = "Email Must Be Provided";
      }
      if (CommonFn.isEmpty(req.body.password)) {
        if (CommonFn.isUndefined(errors)) {
          errors = '';
        } else {
          errors += ', '
        }
        errors += "Password Must Be Provided";
      }

      if (errors) {
        SysLog.error(errors);
        next(new HttpException(400, errors));
      } else {
        next();
      }
    }
  };
}

export default validationUserRegistrationMiddleware;
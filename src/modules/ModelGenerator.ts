/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { schemaIfc } from "./DbModule";
import SqlStr = require('sqlstring');
import CommonFn from "./CommonFnModule";


class ModelGenerator {
    systemFields = ['_req_action_user_',
                    'site_code'];

    public normalSchemaField (fieldName: string): boolean {
        let normalFld = true;
        this.systemFields.some((fld) => {
            if (fld === fieldName) {
                normalFld = false;
                return true;
            }
        })
        return normalFld;
    }

    public systemSchemaField (fieldName: string): boolean {
        return !this.normalSchemaField(fieldName);
    }

    public defineProperty (obj: any, fieldName: string, dflt: any) {
        return CommonFn.defineProperty(obj, fieldName, dflt);
    }

    private excludeFromDTO (prop: schemaIfc, excludeProps: string[] | undefined) {
        let excl = false;
        if (excludeProps !== undefined && excludeProps.length > 0) {
            excludeProps.some((exclProp) => {
                if (exclProp === prop.fieldName) {
                    excl = true;
                    return true;
                }
            })
        }
        return excl;
    }


    /**
     * Append Schema properties to obj for INSERT DTO
     *
     * @param {*} obj
     * @param {schemaIfc[]} schema
     * @param {string[]} [excludeProps]
     * @return {*} 
     * @memberof ModelGenerator
     */
    public getInsertDTOFromSchema( obj: any, schema: schemaIfc[], excludeProps?: string[], toCamelCase?: boolean) {
        schema.forEach((prop) => {
            if (prop.fieldName !== 'id' &&
                prop.fieldName !== 'site_code' &&
                prop.fieldName !== 'last_update_usec' &&
                prop.fieldName !== "INDEX" && 
                !this.excludeFromDTO(prop, excludeProps)) {
                  const fieldName = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
                  if (!CommonFn.hasProperty(obj, fieldName)) {
                    obj = CommonFn.defineProperty(obj, fieldName, prop.default);
                  }
            }
        });
        return obj;
    }


   private fieldValueDsp(prop: schemaIfc) {
        let fieldVal = (prop.default) ? prop.default : ' ';
        fieldVal += prop.allowNull ? ' <OPTIONAL>' : ' <REQUIRED>';
        fieldVal += prop.sqlType + ' ';
        fieldVal += prop.size ? 'MAX SIZE ' + prop.size : ' ';
        return fieldVal;
    }

/**
 * Append schema properties to obj - data DTO
 * @param obj - if null then generate a display object
 * @param schema - schema
 * @param excludeProps - schema field names to exclude
 */
    public genDTOFromSchema(obj: any, 
                            schema: schemaIfc[], 
                            excludeProps?: string[],
                            dataObj?: any, 
                            toCamelCase?: boolean) {
        if (dataObj === null) {
            schema.forEach((prop) => {
                if (prop.fieldName !== "INDEX" && !this.excludeFromDTO(prop, excludeProps)) {
                    const fieldName = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
                    if (!CommonFn.hasProperty(obj, fieldName)) {
                        obj = CommonFn.defineProperty(obj, fieldName, this.fieldValueDsp(prop));
                    }
                }
            });
        } else {
            schema.forEach((prop) => {
                if (prop.fieldName !== "INDEX" && !this.excludeFromDTO(prop, excludeProps)) {
                    const fieldName = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
                    if (!CommonFn.hasProperty(obj, fieldName)) {
                        obj = CommonFn.defineProperty(obj, fieldName, prop.default);
                    }
                }
            });
        }
        return obj;
    }

/**
 * creates a new data DTO from schema
 * @param schema 
 * @param excludeProps 
 */
    public genSchemaModel(schema: schemaIfc[], excludeProps?: string[], toCamelCase?: boolean) {
        let obj = Object.create(null);
        schema.forEach((prop) => {
            if (prop.fieldName !== "INDEX" && !this.excludeFromDTO(prop, excludeProps)) {
                const fieldName = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
                obj = CommonFn.defineProperty(obj, fieldName, prop.default);
            }
        });
        return obj;
    }


/**
 * Append schema properties to obj - UPDATE DTO
 * @param obj - if null then generate a display object
 * @param schema - schema
 * @param excludeProps  - schema field names to exclude
 */
    public genUpdDTOFromSchema( obj: any, 
                                schema: schemaIfc[], 
                                excludeProps?: string[],
                                dataObj?: any,
                                toCamelCase?: boolean) {
        if (dataObj === null) {
            schema.forEach((prop) => {
                if (prop.fieldName !== "INDEX" && !this.excludeFromDTO(prop, excludeProps)) {
                    if (prop.excludeFromUpdate === undefined ||
                        (prop.excludeFromUpdate !== undefined && prop.excludeFromUpdate === false)) {
                        const fieldName = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
                        if (!CommonFn.hasProperty(obj, fieldName)) {
                            obj = CommonFn.defineProperty(obj, fieldName, this.fieldValueDsp(prop));
                        }
                    }
                }
            });
        } else {
            schema.forEach((prop) => {
                if (prop.fieldName !== "INDEX" && !this.excludeFromDTO(prop, excludeProps)) {
                    if (prop.excludeFromUpdate === undefined ||
                        (prop.excludeFromUpdate !== undefined && prop.excludeFromUpdate === false)) {
                            const fieldName = CommonFn.toCamelCase(prop.fieldName, toCamelCase);
                            if (!CommonFn.hasProperty(obj, fieldName)) {
                                obj = CommonFn.defineProperty(obj, fieldName, prop.default);
                            }
                    }
                }
            });
        }

        return obj;
    }

/**
 * Create new UPDATE DTO from schema
 * @param schema 
 * @param excludeProps 
 */
    public genUpdateSchemaModel(schema: schemaIfc[], excludeProps?: string[], toCamelCase?: boolean) {
        let obj = Object.create(null);
        schema.forEach((prop) => {
            if (prop.fieldName !== "INDEX" && !this.excludeFromDTO(prop, excludeProps)) {
                if (prop.excludeFromUpdate === undefined ||
                    (prop.excludeFromUpdate !== undefined && prop.excludeFromUpdate === false)) {
                    const fieldName = CommonFn.toCamelCase(prop.fieldName, toCamelCase);

                    obj = CommonFn.defineProperty(obj, fieldName, prop.default);
                }
            }
        });
        return obj;
    }

    public getSchema (schema: schemaIfc[], fieldName: string): schemaIfc | undefined {
        let colProp: schemaIfc | undefined;
        schema.some((col) => {
            if (col.fieldName === fieldName) {
                colProp = col;
                return true;
            }
        })
        return colProp;
    }

    public validateInsertDTOSchema({ schema, requestDTO }: { schema: schemaIfc[]; requestDTO: any; }, toCamelCase?: boolean): string | undefined {
        let error: string | undefined = '';
        let errorMsg: string | undefined = undefined;
        for (const prop in requestDTO) {
            const fieldName = CommonFn.toSnakeCase(prop, toCamelCase);
            if (this.normalSchemaField(fieldName)) {
                const colProp = this.getSchema(schema, fieldName);
                if (colProp === undefined) {
                    error += fieldName + ' not in schema! ';
                } else {
                    error = this.validateProperty(colProp, error, requestDTO, prop);
                }
            }
        }
        schema.forEach((colProp) => {
            const prop = CommonFn.toCamelCase(colProp.fieldName, toCamelCase);
            if (!CommonFn.hasProperty(requestDTO, prop)) {
                if (colProp.postRequired) {
                    error += prop + ' not defined! '
                }
            }
        });
        if (error !== undefined && error.length > 0) {
            errorMsg = "Invalid requestDTO : " + error;
        }

        return errorMsg;
    }

    public validateCreateDTOSchema({ schema, postDTO }: { schema: schemaIfc[]; postDTO: any; }, toCamelCase?: boolean): string | undefined {
        let error: string | undefined = '' ;
        let errorMsg: string | undefined = undefined;

        schema.forEach((colProp) => {
            const prop = CommonFn.toCamelCase(colProp.fieldName, toCamelCase);
            if (postDTO[prop]) {
                error = this.validateProperty(colProp, error, postDTO, prop);
            } else {
                if (colProp.postRequired) {
                    error += prop + ' not defined! '
                }
            }
        });

        if (error !== undefined && error.length > 0) {
            errorMsg = "Invalid postDTO : " + error;
        }

        return errorMsg;
    }

    public validateUpdateDTOSchema({ schema, requestDTO }: { schema: schemaIfc[]; requestDTO: any; }, toCamelCase?: boolean): string | undefined {
        let error: string | undefined = '';
        let errorMsg: string | undefined = undefined;
        for (const prop in requestDTO) {
            const fieldName = CommonFn.toSnakeCase(prop, toCamelCase);
            if (this.normalSchemaField(fieldName)) {
                const colProp = this.getSchema(schema, fieldName);
                if (colProp === undefined) {
                    error += fieldName + ' not in schema! ';
                } else {
                    if (colProp.excludeFromUpdate != undefined &&
                        colProp.excludeFromUpdate &&
                        colProp.fieldName !== 'id') {
                       // error += fieldName + ' cannot be updated! ';
                       console.info('ignored non-updatable field :' + fieldName);
                    } else {
                        error = this.validateProperty(colProp, error, requestDTO, prop);
                    }
                }
            }
        }
        if (error !== undefined && error.length > 0) {
            errorMsg = "Invalid requestDTO : " + error;
        }

        return errorMsg;
    }


    private validateProperty(colProp: schemaIfc, 
                             error: string | undefined, 
                             postDTO: any, 
                             prop: string) {
        if (colProp.fieldName === 'INDEX') {
            error += prop + ' invalid property! ';
        }
        else {
            if (CommonFn.isString(postDTO[prop]) || postDTO[prop] === null) {
                if (postDTO[prop] !== null && colProp.trim) {
                    postDTO[prop].trim();
                }
                if (!colProp.allowNull) {
                    if (CommonFn.isUndefined(colProp.default)) {
                        if (postDTO[prop] === null) {
                            error += prop + ' must not be null, ';
                        }
                    } else {
                        if (postDTO[prop] === null) {
                            postDTO[prop] = colProp.default;
                        }
                    }
                }
                if (colProp.sqlType?.includes('ENUM', 0)) {
                    let foundEnum = false;
                    if (colProp.enum) {
                        colProp.enum.some((val) => {
                            if (val === postDTO[prop]) {
                                foundEnum = true;
                                return true;
                            }
                        });
                    }
                    if (!foundEnum) {
                        error += prop + ' undefined enum value, ';
                    }
                }
                else {
                    if (colProp.sqlType?.includes('VARCHAR')) {
                        let escStr = SqlStr.escape(postDTO[prop]);
                        escStr = escStr.replace("'","");
                        escStr = escStr.replace("'","");
                        if (colProp.size != undefined && colProp.size > 0) {
                            if (escStr.length > colProp.size) {
                                error += prop + ' exceed string length of ' + colProp.size + ', ';
                            }
                        }
                    }
                }
            }
            else {
                if (colProp.sqlType?.includes('VARCHAR') || colProp.sqlType?.includes('TEXT') || colProp.sqlType?.includes('BLOB') || colProp.sqlType?.includes('ENUM')) {
                    error += prop + ' invalid property value, ';
                }
            }
        }
        return error;
    }
}

const DTOGenerator = new ModelGenerator();

export default DTOGenerator;
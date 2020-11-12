/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { schemaIfc } from "./DbModule";
import { isUndefined, isString } from "util";
import SqlStr = require('sqlstring');


class ModelGenerator {
    /**
  * This function adds a new property to obj object
  * @param obj - target obj
  * @param fieldName - new property name
  * @param dflt - default value of property
  */
    public defineProperty(obj: any, fieldName: string, dflt: any) {
        return Object.defineProperty(obj, fieldName, {
            value: dflt,
            writable: true,
            configurable: true,
            enumerable: true,
        });
    }

    private excludeFromDTO (prop: schemaIfc, excludeProps: string[] | undefined) {
        let excl = false;
        if (!isUndefined(excludeProps) && excludeProps.length > 0) {
            excludeProps.some((exclProp) => {
                if (exclProp === prop.fieldName) {
                    excl = true;
                    return true;
                }
            })
        }
        return excl;
    }

    public genSchemaModel(schema: schemaIfc[], excludeProps?: string[]) {
        let obj = Object.create(null);
        schema.forEach((prop) => {
            if (prop.fieldName !== "INDEX" && !this.excludeFromDTO(prop, excludeProps)) {
                obj = this.defineProperty(obj, prop.fieldName, prop.default);
            }
        });
        return obj;
    }

    public genUpdateSchemaModel(schema: schemaIfc[], excludeProps?: string[]) {
        let obj = Object.create(null);
        schema.forEach((prop) => {
            if (prop.fieldName !== "INDEX" && !this.excludeFromDTO(prop, excludeProps)) {
                if (isUndefined(prop.excludeFromUpdate) ||
                    (!isUndefined(prop.excludeFromUpdate) && prop.excludeFromUpdate)) {
                    obj = this.defineProperty(obj, prop.fieldName, prop.default);
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

    public validateDTOSchema({ schema, requestDTO }: { schema: schemaIfc[]; requestDTO: any; }): string | undefined {
        let error: string | undefined = '';
        let errorMsg: string | undefined = undefined;
        for (const prop in requestDTO) {
            const colProp = this.getSchema(schema, prop);
            if (isUndefined(colProp)) {
                error += prop + ' not defined! ';
            } else {
                error = this.validateProperty(colProp, error, requestDTO);
            }
        }
        if (isUndefined(error) || error.length > 0) {
            errorMsg = "Invalid requestDTO : " + error;
        }

        return errorMsg;
    }

    public validateUpdateDTOSchema({ schema, requestDTO }: { schema: schemaIfc[]; requestDTO: any; }): string | undefined {
        let error: string | undefined = '';
        let errorMsg: string | undefined = undefined;
        for (const prop in requestDTO) {
            const colProp = this.getSchema(schema, prop);
            if (isUndefined(colProp)) {
                error += prop + ' not defined! ';
            } else {
                if (!isUndefined(colProp.excludeFromUpdate) && colProp.excludeFromUpdate) {
                    error += prop + ' cannot be updated! ';
                } else {
                    error = this.validateProperty(colProp, error, requestDTO);
                }
            }
        }
        if (isUndefined(error) || error.length > 0) {
            errorMsg = "Invalid requestDTO : " + error;
        }

        return errorMsg;
    }
    public validateCreateDTOSchema({ schema, postDTO }: { schema: schemaIfc[]; postDTO: any; }): string | undefined {
        let error: string | undefined = '' ;
        let errorMsg: string | undefined = undefined;

        schema.forEach((colProp) => {
            if (postDTO[colProp.fieldName]) {
                error = this.validateProperty(colProp, error, postDTO);
            } else {
                if (colProp.postRequired) {
                    error += colProp.fieldName + ' not defined! '
                }
            }
        });

        if (isUndefined(error) || error.length > 0) {
            errorMsg = "Invalid postDTO : " + error;
        }

        return errorMsg;
    }

    private validateProperty(colProp: schemaIfc, error: string | undefined, postDTO: any) {
        if (colProp.fieldName === 'INDEX') {
            error += colProp.fieldName + ' invalid property! ';
        }
        else {
            if (isString(postDTO[colProp.fieldName])) {
                if (colProp.trim) {
                    postDTO[colProp.fieldName].trim();
                }
                if (!colProp.allowNull) {
                    if (isUndefined(colProp.default)) {
                        if (postDTO[colProp.fieldName] === null) {
                            error += colProp.fieldName + ' must not be null, ';
                        }
                    } else {
                        if (postDTO[colProp.fieldName] === null) {
                            postDTO[colProp.fieldName] = colProp.default;
                        }
                    }
                }
                if (colProp.sqlType?.includes('ENUM', 0)) {
                    let foundEnum = false;
                    colProp.enum.some((val) => {
                        if (val === postDTO[colProp.fieldName]) {
                            foundEnum = true;
                            return true;
                        }
                    });
                    if (!foundEnum) {
                        error += colProp.fieldName + ' undefined enum value, ';
                    }
                }
                else {
                    let escStr = SqlStr.escape(postDTO[colProp.fieldName]);
                    escStr = escStr.replace("'","");
                    escStr = escStr.replace("'","");
                    if (!isUndefined(colProp.size)) {
                        if (escStr.length > colProp.size) {
                            error += colProp.fieldName + ' exceed string length of ' + colProp.size + ', ';
                        }
                    }
                }
            }
            else {
                if (colProp.sqlType?.includes('VARCHAR') || colProp.sqlType?.includes('BLOB') || colProp.sqlType?.includes('ENUM')) {
                    error += colProp.fieldName + ' invalid property type, ';
                }
            }
        }
        return error;
    }
}

const DTOGenerator = new ModelGenerator();

export default DTOGenerator;
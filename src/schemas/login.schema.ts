import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const loginDTO_schema: schemaIfc[] = [
    {        fieldName: 'user_id',
        sqlType: 'VARCHAR(20)',
        size: 20,
        allowNull: false,
        default: '',
        trim: true,
        enum: [],
        index: []
    },
    {        fieldName: 'email',
        sqlType: 'VARCHAR(60)',
        size: 60,
        allowNull: false,
        default: '',
        trim: true,
        enum: [],
        index: []
    },
    {        fieldName: 'password',
        sqlType: 'VARCHAR(256)',
        size: 20,
        allowNull: false,
        default: '',
        trim: true,
        enum: [],
        index: [],
        encrypt: true,
        bcryptIt: true,
        excludeFromSelect: true
    },

];

const LoginSchemaModel = DTOGenerator.genSchemaModel(loginDTO_schema);
export type LoginData = typeof LoginSchemaModel;
import { logs_schema, logs_schema_table } from './logs.schema';
import { tableIfc } from '../modules/DbModule';
import { users_schema, users_schema_table } from './users.schema';
import { token_schema, tokens_schema_table, blacklist_tokens_schema_table } from './tokens.schema';
import { accounts_schema, accounts_schema_table } from './accounts.schema';
import { userAccounts_schema, userAccounts_schema_table } from './userAccounts.schema';

export const sysTables: tableIfc[] = [
  {
    name: users_schema_table,
    schema: users_schema
  },
  {
    name: tokens_schema_table,
    schema: token_schema
  },
  {
    name: blacklist_tokens_schema_table,
    schema: token_schema
  },
  {
    name: accounts_schema_table,
    schema: accounts_schema
  },
  {
    name: userAccounts_schema_table,
    schema: userAccounts_schema
  },
  {
    name: logs_schema_table,
    schema: logs_schema
  }
];

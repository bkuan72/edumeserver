import { tableIfc } from '../modules/DbModule';
import { users_schema } from './users.schema';
import { token_schema } from './tokens.schema';
import { accounts_schema } from './accounts.schema';
import { userAccounts_schema } from './userAccounts.schema';

export const sysTables: tableIfc[] = [
  {
    name: 'users',
    schema: users_schema
  },
  {
    name: 'tokens',
    schema: token_schema
  },
  {
    name: 'blacklistTokens',
    schema: token_schema
  },
  {
    name: 'accounts',
    schema: accounts_schema
  },
  {
    name: 'userAccounts',
    schema: userAccounts_schema
  }
];

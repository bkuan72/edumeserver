import { userGroups_schema, userGroups_schema_table } from './userGroups.schema';
import { groups_schema, groups_schema_table } from './groups.schema';
import { postArticles_schema, postArticles_schema_table } from './postArticles.schema';
import { activities_schema, activities_schema_table } from './activities.schema';
import { medias_schema, medias_schema_table } from './medias.schema';
import { postComments_schema, postComments_schema_table } from './postComments.schema';
import { friends_schema, friends_schema_table } from './friends.schema';
import { postMedias_schema, postMedias_schema_table } from './postMedias.schema';
import { posts_schema, posts_schema_table } from './posts.schema';
import { properties_schema, properties_schema_table } from './properties.schema';
import { logs_schema, logs_schema_table } from './logs.schema';
import { tableIfc } from '../modules/DbModule';
import { users_schema, users_schema_table } from './users.schema';
import { token_schema, tokens_schema_table, blacklist_tokens_schema_table } from './tokens.schema';
import { accounts_schema, accounts_schema_table } from './accounts.schema';
import { userAccounts_schema, userAccounts_schema_table } from './userAccounts.schema';
import { advertisements_schema, advertisements_schema_table } from './advertisements.schema';

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
  },
  {
    name: properties_schema_table,
    schema: properties_schema
  },
  {
    name: advertisements_schema_table,
    schema: advertisements_schema
  },
  {
    name: posts_schema_table,
    schema: posts_schema
  },
  {
    name: postMedias_schema_table,
    schema: postMedias_schema
  },
  {
    name: postComments_schema_table,
    schema: postComments_schema
  },
  {
    name: friends_schema_table,
    schema: friends_schema
  },
  {
    name: medias_schema_table,
    schema: medias_schema
  },
  {
    name: activities_schema_table,
    schema: activities_schema
  },
  {
    name: postArticles_schema_table,
    schema: postArticles_schema
  },
  {
    name: groups_schema_table,
    schema: groups_schema
  },
  {
    name: userGroups_schema_table,
    schema: userGroups_schema
  }
];

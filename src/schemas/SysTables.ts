import { member_security_schema, member_security_schema_table } from './memberSecurities.schema';
import { adAgeGroups_schema, adAgeGroups_schema_table } from './adAgeGroups.schema';
import { adActivities_schema, adActivities_schema_table } from './adActivities.schema';
import { adKeywords_schema, adKeywords_schema_table } from './adKeywords.schema';
import { adCategories_schema, adCategories_schema_table } from './adCategories.schema';
import { userGroups_schema, userGroups_schema_table } from './userGroups.schema';
import { socialGroups_schema, socialGroups_schema_table } from './groups.schema';
import { postArticles_schema, postArticles_schema_table } from './postArticles.schema';
import { activities_schema, activities_schema_table } from './activities.schema';
import { userMedias_schema, userMedias_schema_table } from './userMedias.schema';
import { userTimelineComments_schema, userTimelineComments_schema_table } from './userTimelineComments.schema';
import { friends_schema, friends_schema_table } from './friends.schema';
import { postMedias_schema, postMedias_schema_table } from './postMedias.schema';
import { posts_schema, posts_schema_table } from './posts.schema';
import { tableIfc } from '../modules/DbModule';
import { advertisements_schema, advertisements_schema_table } from './advertisements.schema';
import { userTimelines_schema, userTimelines_schema_table } from './userTimelines.schema';
import { accountGroupTimelines_schema, accountGroupTimelines_schema_table } from './accountGroupTimelines.schema';
import { accountGroupTimelineComments_schema, accountGroupTimelineComments_schema_table } from './accountGroupTimelineComments.schema';
import { accountGroupMedias_schema, accountGroupMedias_schema_table } from './accountGroupMedias.schema';
import { accountGroupMediaPeriods_schema, accountGroupMediaPeriods_schema_table } from './accountGroupMediaPeriods.schema';
import { userMediaPeriods_schema, userMediaPeriods_schema_table } from './userMediaPeriods.schema';
import { accountGroupMembers_schema, accountGroupMembers_schema_table } from './accountGroupMembers.schema';
import { accountGroupActivities_schema, accountGroupActivities_schema_table } from './accountGroupActivities.schema';

export const sysTables: tableIfc[] = [
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
    name: userTimelines_schema_table,
    schema: userTimelines_schema
  },
  {
    name: userTimelineComments_schema_table,
    schema: userTimelineComments_schema
  },
  {
    name: userMedias_schema_table,
    schema: userMedias_schema
  },
  {
    name: userMediaPeriods_schema_table,
    schema: userMediaPeriods_schema
  },
  {
    name: friends_schema_table,
    schema: friends_schema
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
    name: socialGroups_schema_table,
    schema: socialGroups_schema
  },
  {
    name: userGroups_schema_table,
    schema: userGroups_schema
  },
  {
    name: adCategories_schema_table,
    schema: adCategories_schema
  },
  {
    name: adKeywords_schema_table,
    schema: adKeywords_schema
  },
  {
    name: adActivities_schema_table,
    schema: adActivities_schema
  },
  {
    name: adAgeGroups_schema_table,
    schema: adAgeGroups_schema
  },
  // {
  //   name: roles_schema_table,
  //   schema: roles_schema
  // },
  // {
  //   name: modules_schema_table,
  //   schema: modules_schema
  // },
  // {
  //   name: userModuleRoles_schema_table,
  //   schema: userModuleRoles_schema
  // },
  {
    name: accountGroupTimelines_schema_table,
    schema: accountGroupTimelines_schema
  },
  {
    name: accountGroupTimelineComments_schema_table,
    schema: accountGroupTimelineComments_schema
  },
  {
    name: accountGroupMedias_schema_table,
    schema: accountGroupMedias_schema
  },
  {
    name: accountGroupMediaPeriods_schema_table,
    schema: accountGroupMediaPeriods_schema
  },
  {
    name: accountGroupMembers_schema_table,
    schema: accountGroupMembers_schema
  },
  {
    name: accountGroupActivities_schema_table,
    schema: accountGroupActivities_schema
  },
  {
    name: member_security_schema_table,
    schema: member_security_schema
  }
];

import { AccountGroupActivitiesController } from './server/controllers/accountGroupActivities.controller';
import { AccountGroupMediaPeriodsController } from './server/controllers/accountGroupMediaPeriods.controller';
import { AccountGroupMediasController } from './server/controllers/accountGroupMedias.controller';
import { UserMediaPeriodsController } from './server/controllers/userMediaPeriods.controller';
import { UserMediasController } from './server/controllers/userMedias.controller';
import { UserModuleRolesController } from './server/controllers/userModuleRoles.controller';
import { ModulesController } from './server/controllers/modules.controller';
import { RolesController } from './server/controllers/roles.controller';
import { AdKeywordsController } from './server/controllers/adKeywords.controller';
import { AdCategoriesController } from './server/controllers/adCategories.controller';
import { UserTimelinessController } from './server/controllers/userTimelines.controller';
import SysLog from './modules/SysLog';
import toobusy_js from 'toobusy-js';
import SysEnv from './modules/SysEnv';
import { ActivitiesController } from './server/controllers/activities.controller';
import { GroupsController } from './server/controllers/groups.controller';
import { FriendsController } from './server/controllers/friends.controller';
import { PostMediasController } from './server/controllers/postMedias.controller';
import { UserTimelineCommentsController } from './server/controllers/userTimelineComments.controller';
import { AdvertisementsController } from './server/controllers/advertisement.controller';
import { PropertiesController } from './server/controllers/properties.controller';
import { TokensController } from './server/controllers/tokens.controller';
import { LogsController } from './server/controllers/logs.controller';
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config'; // loads the .env environment
import validateEnv from './utils/validateEnv';
import App from './app';
import { UsersController } from './server/controllers/users.controller';
import AuthenticationController from './server/controllers/authentication.controller';
import { AccountsController } from './server/controllers/accounts.controller';
import { UserAccountsController } from './server/controllers/userAccounts.controller';
import { BlacklistController } from './server/controllers/blacklist.controller';
import { PostsController } from './server/controllers/posts.controller';
import { UserGroupsController } from './server/controllers/userGroups.controller';
import { AdActivitiesController } from './server/controllers/adActivities.controller';
import { AdAgeGroupsController } from './server/controllers/adAgeGroups.controller';
import { AccountGroupTimelinesController } from './server/controllers/accountGroupTimelines.controller';
import { AccountGroupTimelineCommentsController } from './server/controllers/accountGroupTimelineComments.controller';
import { AccountGroupMembersController } from './server/controllers/accountGroupMembers.controller';

// validate that all required environment variable is present
SysEnv.init();
validateEnv();

// const blacklistTokens = new TokenModel(blacklist_tokens_schema_table);
// const tokens = new TokenModel(tokens_schema_table);

const port = SysEnv.PORT;


const app = new App (
  [
    new AuthenticationController(),
    new UsersController(),
    new AccountsController(),
    new UserAccountsController(),
    new LogsController(),
    new TokensController(),
    new BlacklistController(),
    new PropertiesController(),
    new AdvertisementsController(),
    new UserTimelineCommentsController(),
    new PostsController(),
    new PostMediasController(),
    new FriendsController(),
    new GroupsController(),
    new UserGroupsController(),
    new ActivitiesController(),
    new UserTimelinessController(),
    new AdCategoriesController(),
    new AdKeywordsController(),
    new AdActivitiesController(),
    new AdAgeGroupsController(),
    new ModulesController(),
    new RolesController(),
    new UserModuleRolesController(),
    new UserMediasController(),
    new UserMediaPeriodsController(),
    new AccountGroupMediasController(),
    new AccountGroupMediaPeriodsController(),
    new AccountGroupTimelinesController(),
    new AccountGroupTimelineCommentsController(),
    new AccountGroupMembersController(),
    new AccountGroupActivitiesController(),
  ],
  port
);
SysLog.info('Cron setup to purge expired blacklistTokens every minute')

app.listen();

process.on('SIGINT', function() {
  // app.close();
  // calling .shutdown allows your process to exit normally
  toobusy_js.shutdown();
  process.exit();
});


import { ActivitiesController } from './server/controllers/activities.controller';
import { MediasController } from './server/controllers/medias.controller';
import { GroupsController } from './server/controllers/groups.controller';
import { FriendsController } from './server/controllers/friends.controller';
import { PostMediasController } from './server/controllers/postMedias.controller';
import { PostCommentsController } from './server/controllers/postComments.controller';
import { AdvertisementsController } from './server/controllers/advertisement.controller';
import { PropertiesController } from './server/controllers/properties.controller';
import { TokensController } from './server/controllers/tokens.controller';
import { LogsController } from './server/controllers/logs.controller';
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import App from './app';
import { UsersController } from './server/controllers/users.controller';
import AuthenticationController from './server/controllers/authentication.controller';
import { AccountsController } from './server/controllers/accounts.controller';
import { UserAccountsController } from './server/controllers/userAccounts.controller';
import * as cron from 'node-cron';
import { TokenModel } from './server/models/token.model';
import SysLog from './modules/SysLog';
import toobusy_js from 'toobusy-js';
import SysEnv from './modules/SysEnv';
import { blacklist_tokens_schema_table, tokens_schema_table } from './schemas/tokens.schema';
import { BlacklistController } from './server/controllers/blacklist.controller';
import { PostsController } from './server/controllers/posts.controller';
import { UserGroupsController } from './server/controllers/userGroups.controller';

// validate that all required environment variable is present
SysEnv.init();
validateEnv();

const blacklistTokens = new TokenModel(blacklist_tokens_schema_table);
const tokens = new TokenModel(tokens_schema_table);

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
    new PostCommentsController(),
    new PostsController(),
    new PostMediasController(),
    new FriendsController(),
    new GroupsController(),
    new UserGroupsController(),
    new MediasController(),
    new ActivitiesController()
  ],
  port
);
SysLog.info('Cron setup to purge expired blacklistTokens every minute')

const cronTasks: cron.ScheduledTask[] = [
  cron.schedule('* 3 5 * * *', () => {
    SysLog.info('cron run at 5.03am to purge expired blacklist token');
    blacklistTokens.purgeExpired();
  }),
  cron.schedule('* */15 * * * * *', () => {
    // SysLog.info('cron run every 15 minutes to purge expired tokens');
    tokens.purgeExpired();
  })
];

cronTasks.forEach((task) => {
  task.start();
});

app.listen();

process.on('SIGINT', function() {
  // app.close();
  // calling .shutdown allows your process to exit normally
  toobusy_js.shutdown();
  process.exit();
});


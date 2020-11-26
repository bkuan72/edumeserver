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
    new LogsController()
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


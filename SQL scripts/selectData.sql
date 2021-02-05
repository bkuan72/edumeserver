use testdb;

select BIN_TO_UUID(id), BIN_TO_UUID(uuid), BIN_TO_UUID(user_id) from tokens;
select BIN_TO_UUID(id), BIN_TO_UUID(uuid), BIN_TO_UUID(user_id) from blacklist_tokens;
select * from users;
select BIN_TO_UUID(id), account_type from accounts;
select BIN_TO_UUID(account_id), BIN_TO_UUID(user_id), site_code, status from user_accounts;
select * from logs;
select * from properties;
select * from advertisements;
select * from post_medias;
select * from friends;
select * from posts;
select BIN_TO_UUID(post_user_id), BIN_TO_UUID(timeline_user_id), likes from user_timelines;
select * from user_timeline_comments;
select BIN_TO_UUID(user_id), BIN_TO_UUID(timeline_user_id) from activities;
select * from post_medias;

delete from logs;
delete from accounts;
delete from user_accounts;
delete from users;
delete from tokens;
delete from blacklist_tokens;
delete from advertisements;

delete from posts;
delete from user_timeline_comments;
delete from user_timelines;
delete from activities;

drop table accounts, users, user_accounts;
drop table advertisements;
drop table entities;
drop table logs;
drop table properties;
drop table users;
drop table user_accounts;
drop table tokens;
drop table blacklist_tokens;
drop table posts;
drop table post_medias;
drop table user_timelines;
drop table post_comments;
drop table activities;

drop table advertisements;
drop table userMedias;

drop table adCategories;
drop table adGroups;
drop table adKeywords;
drop table userGroups;
drop table userMedias;
drop table properties;


ALTER TABLE accounts MODIFY account_type ENUM('ADMIN','DEV','NORMAL','SERVICE');
ALTER TABLE activities MODIFY activity_type ENUM('LIKES', 'SHARE', 'MESSAGED', 'FOLLOW_REQUEST', 'FRIEND_REQUEST', 'JOIN_REQUEST');

SELECT accounts.account_type,  BIN_TO_UUID(user_accounts.user_id)
FROM user_accounts
INNER JOIN accounts ON user_accounts.account_id = accounts.id;

UPDATE user_timelines SET likes = likes + 1  WHERE id = UUID_TO_BIN('5e18269f-5f85-11eb-bc79-3417ebc95b70')

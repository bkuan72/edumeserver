use testdb;

select BIN_TO_UUID(id), BIN_TO_UUID(uuid), BIN_TO_UUID(user_id) from tokens;
select BIN_TO_UUID(id), BIN_TO_UUID(uuid), BIN_TO_UUID(user_id) from blacklist_tokens;
select * from users;
select * from accounts;
select * from user_accounts;
select * from logs;
select * from properties;
select * from advertisements;
select * from posts;


delete from logs;
delete from accounts;
delete from user_accounts;
delete from users;
delete from tokens;
delete from blacklist_tokens;

drop table accounts;
drop table advertisements;
drop table entities;
drop table logs;
drop table properties;
drop table users;
drop table user_accounts;
drop table tokens;
drop table blacklist_tokens;
drop table posts;

use testdb;

select BIN_TO_UUID(id), BIN_TO_UUID(uuid), BIN_TO_UUID(user_id) from tokens;
select BIN_TO_UUID(id), BIN_TO_UUID(uuid), BIN_TO_UUID(user_id) from blacklist_tokens;
select * from users;
select * from user_accounts;
select * from users;
select * from logs;


delete from logs;
delete from users;
delete from tokens;
delete from blacklist_tokens;

drop table userAccounts;
drop table tokens;
drop table blacklist_tokens;

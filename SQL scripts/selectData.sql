use testdb;
drop database testdb;
create database testdb;

select BIN_TO_UUID(id), BIN_TO_UUID(uuid), BIN_TO_UUID(user_id) from tokens;
select BIN_TO_UUID(id), BIN_TO_UUID(uuid), BIN_TO_UUID(user_id) from blacklist_tokens;
select BIN_TO_UUID(id) from users;
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
select * from accounts;
select BIN_TO_UUID(user_id), BIN_TO_UUID(account_id) from user_accounts;
select * from roles;
select * from modules;
select BIN_TO_UUID(user_id), BIN_TO_UUID(module_id),  BIN_TO_UUID(role_id)  from userModuleRoles;
select * from tokens;
select * from blacklist_tokens;
select * from activities;

select  BIN_TO_UUID(id) from userMediaPeriods;
select  BIN_TO_UUID(id) from accounts;
select BIN_TO_UUID(userMediaPeriod_id), BIN_TO_UUID(id),  BIN_TO_UUID(user_id) from userMedias where id = UUID_TO_BIN('3ea95a5f-7d8b-11eb-aecf-3417ebc95b70');
select * from userMediaPeriods;
select * from userMedias;	

select * from friends;
select activity_type, BIN_TO_UUID(user_id),  BIN_TO_UUID(account_id),  BIN_TO_UUID(group_id),  BIN_TO_UUID(members_id),  BIN_TO_UUID(timeline_user_id),  BIN_TO_UUID(timeline_id) from activities;
delete from activities;

select BIN_TO_UUID(id) from accounts;
select activity_type, BIN_TO_UUID(user_id),  BIN_TO_UUID(account_id),  BIN_TO_UUID(group_id),  BIN_TO_UUID(member_id),  BIN_TO_UUID(timeline_account_id),  BIN_TO_UUID(timeline_group_id),  BIN_TO_UUID(timeline_id)  from accountGroupActivities;	
select BIN_TO_UUID(member_id),  BIN_TO_UUID(account_id),  BIN_TO_UUID(group_id), member_status from accountGroupMembers;
select BIN_TO_UUID(post_id), BIN_TO_UUID(id),  BIN_TO_UUID(user_id),  BIN_TO_UUID(post_user_id), BIN_TO_UUID(account_id),  BIN_TO_UUID(group_id) from accountGroup_timelines;
select BIN_TO_UUID(accountGroupMediaPeriod_id), BIN_TO_UUID(id),  BIN_TO_UUID(user_id),  BIN_TO_UUID(account_id),  BIN_TO_UUID(group_id) from accountGroupMedias; 
select BIN_TO_UUID(id),  BIN_TO_UUID(user_id),  BIN_TO_UUID(account_id),  BIN_TO_UUID(group_id)  from accountGroupMediaPeriods;



delete from userMediaPeriods;
delete from userMedias;	

delete from logs;
delete from accounts;
delete from user_accounts;
delete from users;
delete from tokens;
delete from blacklist_tokens;
delete from advertisements;

delete from activities;
delete from accountGroupActivities;
delete from accountGroupMembers;
delete from friends;

select * from friends;
select BIN_TO_UUID(user_id), BIN_TO_UUID(friend_id), BIN_TO_UUID(account_id), status, friend_status  from friends;
select BIN_TO_UUID(account_id), BIN_TO_UUID(user_id), BIN_TO_UUID(group_id),  status, member_status  from accountGroupMembers;


delete from posts;
delete from user_timeline_comments;
delete from user_timelines;

delete from activities;
delete from friends;

drop table accounts, users, accounts;
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
drop table accountGroupMedias, accountGroup_timeline_comments, accountGroup_timelines;
drop table accountGroupMedias, userMedias;
drop table logs;
drop table friends;
drop table accountGroupMedias, accountGroupMediaPeriods;
drop table activities;

drop table friends, accountGroupMembers;

drop table accountGroupMembers, accountGroupActivities;	

SELECT BIN_TO_UUID(friends.id) , friends.site_code, friends.status, BIN_TO_UUID(friends.user_id) , BIN_TO_UUID(friends.friend_id) , friends.friend_date, friends.friend_group, friends.first_name, friends.last_name, friends.avatar, friends.nickname, friends.email, friends.phone_no, friends.company, friends.job_title, friends.address, friends.birthday, friends.notes, friends.starred, friends.frequent, friends.friend_req_date, friends.friend_block_date, friends.friend_status, friends.lastUpdateUsec, BIN_TO_UUID(users.id) , users.site_code, users.title, users.user_name, users.first_name, users.last_name, users.email, users.phone_no, users.mobile_no, users.website, users.avatar, users.language, users.address, users.suburb, users.city, users.state, users.country, users.gender, users.birthday, users.post_code, users.about_me, users.occupation, users.skills, users.jobs, users.status, users.reg_confirm_key, users.pwd_reset_key, users.lastUpdateUsec FROM friends LEFT OUTER JOIN users ON users.id = friends.friend_id WHERE friends.site_code = 'TEST' AND friends.status != 'DELETED' AND friends.user_id = UUID_TO_BIN('023e125d-7829-11eb-bf79-3417ebc95b70');
SELECT BIN_TO_UUID(users.id), users.user_name, users.avatar FROM users WHERE users.site_code = 'TEST' AND users.status != 'DELETED' AND (users.user_name LIKE '%edu%'  OR  users.email LIKE '%edu%');

drop table advertisements;
drop table userMedias;

drop table adCategories;
drop table adGroups;
drop table adKeywords;
drop table userGroups;
drop table userMedias;
drop table properties;
drop table postArticles;
drop table accgroups;
drop table properties;
drop table friends;


ALTER TABLE accounts MODIFY account_type ENUM('ADMIN','DEV','NORMAL','SERVICE');
ALTER TABLE activities MODIFY activity_type ENUM('LIKES', 'SHARE', 'MESSAGED', 'FOLLOW_REQUEST', 'FRIEND_REQUEST', 'JOIN_REQUEST');

SELECT accounts.account_type,  BIN_TO_UUID(user_accounts.user_id)
FROM user_accounts
INNER JOIN accounts ON user_accounts.account_id = accounts.id;

UPDATE user_timelines SET likes = likes + 1  WHERE id = UUID_TO_BIN('5e18269f-5f85-11eb-bc79-3417ebc95b70');

SELECT BIN_TO_UUID(id) id, site_code, advert_by, BIN_TO_UUID(ad_by_id) ad_by_id, header, sub_header, url, excerpt, adAgeGroups, categories, keywords, image, start_date, end_date, priority_code, address, suburb, city, state, country, status, lastUpdateUsec 
FROM advertisements 
WHERE site_code='TEST' AND  
status != 'DELETED' AND  
(
(start_date <= '2021-02-11T02:51:41.862Z' 
AND  end_date >= '2021-02-11T02:51:41.862Z') 
OR 
(start_date = ''
 AND  end_date = '')
);
SELECT BIN_TO_UUID(accountGroupMembers.id), BIN_TO_UUID(accountGroupMembers.member_id), CONCAT(accountGroupMembers.first_name,' ',accountGroupMembers.last_name), users.avatar,accountGroupMembers.member_date FROM accountGroupMembers LEFT OUTER JOIN users ON users.id = accountGroupMembers.member_id WHERE accountGroupMembers.site_code = 'TEST' AND accountGroupMembers.status != 'DELETED' AND group_id = 0 AND accountGroupMembers.account_id = UUID_TO_BIN('11ab008b-9b0f-11eb-ad3d-3417ebc95b70');

SELECT BIN_TO_UUID(id) id, site_code, status, BIN_TO_UUID(user_id) user_id, BIN_TO_UUID(userMediaPeriod_id) userMediaPeriod_id, upload_date, filename, media_type, title, preview, embed, lastUpdateUsec FROM userMedias WHERE site_code = 'TEST' AND  status != 'DELETED' AND userMediaPeriod_id = UUID_TO_BIN('023e125d-7829-11eb-bf79-3417ebc95b70')
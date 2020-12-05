interface DataStoredInToken {
  user_id: string;
  uuid: string;
  adminUser: boolean;
  site_code: string;
  createTimeStamp: string;
  expireInMin: number;
}

export default DataStoredInToken;
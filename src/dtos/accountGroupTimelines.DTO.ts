import { posts_schema } from './../schemas/posts.schema';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { AccountGroupTimelineData, accountGroupTimelines_schema } from '../schemas/accountGroupTimelines.schema';


export class AccountGroupTimelineDTO {
  data: AccountGroupTimelineData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupTimelines_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdAccountGroupTimelineDTO {
  data: AccountGroupTimelineData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, accountGroupTimelines_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class TimelinePostDTO {
  data: AccountGroupTimelinePostData;
  constructor(accountGroupTimelineData?: any) {
    DTOGenerator.genDTOFromSchema(this, accountGroupTimelines_schema, undefined, accountGroupTimelineData);
    if (!CommonFn.isUndefined(accountGroupTimelineData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(accountGroupTimelineData, prop)) {
          this[prop] = accountGroupTimelineData[prop];
        }
      }
    }
    DTOGenerator.defineProperty(
      this,
      'post',
      DTOGenerator.genSchemaModel(posts_schema)
    );
    DTOGenerator.defineProperty(
      this,
      'comments',
      []
    );
    DTOGenerator.defineProperty(
      this,
      'user',
      {
        id: '',
        username: '',
        avatar: ''
      }
    );
    DTOGenerator.defineProperty(
      this,
      'medias',
      []
    );
    DTOGenerator.defineProperty(
      this,
      'article',
      {
        media: { type: '', preview: ''},
        title: '',
        subtitle: '',
        excerpt: ''
      }
    );
  }


}

const AccountGroupTimelinePostModel = DTOGenerator.genSchemaModel(accountGroupTimelines_schema);
DTOGenerator.defineProperty(
  AccountGroupTimelinePostModel,
  'post',
  DTOGenerator.genSchemaModel(posts_schema)
);
DTOGenerator.defineProperty(
  AccountGroupTimelinePostModel,
  'comments',
  []
);
DTOGenerator.defineProperty(
  AccountGroupTimelinePostModel,
  'accountGroup',
  {
    id: '',
    accountGroup_name: '',
    avatar: ''
  }
);
DTOGenerator.defineProperty(
  AccountGroupTimelinePostModel,
  'medias',
  []
);
DTOGenerator.defineProperty(
  AccountGroupTimelinePostModel,
  'article',
  {
    media: { type: '', preview: ''},
    title: '',
    subtitle: '',
    excerpt: ''
  }
);
export type AccountGroupTimelinePostData = typeof AccountGroupTimelinePostModel;


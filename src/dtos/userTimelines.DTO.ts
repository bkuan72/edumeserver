import { posts_schema } from './../schemas/posts.schema';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { UserTimelineData, userTimelines_schema } from '../schemas/userTimelines.schema';


export class UserTimelineDTO {
   // data: UserTimelineData;
  constructor(propertyData?: any) {
    DTOGenerator.genDTOFromSchema(this, userTimelines_schema, undefined, propertyData);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(propertyData, prop)) {
          this[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdUserTimelineDTO {
   // data: UserTimelineData;
  constructor(propertyData?: any) {
    DTOGenerator.genUpdDTOFromSchema(this, userTimelines_schema, undefined, propertyData);
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
   // data: UserTimelinePostData;
  constructor(userTimelineData?: any) {
    DTOGenerator.genDTOFromSchema(this, userTimelines_schema);
    if (!CommonFn.isUndefined(userTimelineData)) {
      for (const prop in this) {
        if (CommonFn.hasProperty(userTimelineData, prop)) {
          this[prop] = userTimelineData[prop];
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

const UserTimelinePostModel = DTOGenerator.genSchemaModel(userTimelines_schema);
DTOGenerator.defineProperty(
  UserTimelinePostModel,
  'post',
  DTOGenerator.genSchemaModel(posts_schema)
);
DTOGenerator.defineProperty(
  UserTimelinePostModel,
  'comments',
  []
);
DTOGenerator.defineProperty(
  UserTimelinePostModel,
  'user',
  {
    id: '',
    username: '',
    avatar: ''
  }
);
DTOGenerator.defineProperty(
  UserTimelinePostModel,
  'medias',
  []
);
DTOGenerator.defineProperty(
  UserTimelinePostModel,
  'article',
  {
    media: { type: '', preview: ''},
    title: '',
    subtitle: '',
    excerpt: ''
  }
);
export type UserTimelinePostData = typeof UserTimelinePostModel;


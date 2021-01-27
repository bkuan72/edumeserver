import { posts_schema } from './../schemas/posts.schema';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DTOGenerator from '../modules/ModelGenerator';
import CommonFn from '../modules/CommonFnModule';
import { UserTimelineData, userTimelines_schema } from '../schemas/userTimelines.schema';


export class UserTimelineDTO {
  data: UserTimelineData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genSchemaModel(userTimelines_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class UpdUserTimelineDTO {
  data: UserTimelineData;
  constructor(propertyData?: any) {
    this.data = DTOGenerator.genUpdateSchemaModel(userTimelines_schema);
    if (!CommonFn.isUndefined(propertyData)) {
      for (const prop in propertyData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = propertyData[prop];
        }
      }
    }
  }
}

export class TimelinePostDTO {
  data: any;
  constructor(userTimelineData?: any) {
    this.data = DTOGenerator.genSchemaModel(userTimelines_schema);
    if (!CommonFn.isUndefined(userTimelineData)) {
      for (const prop in userTimelineData) {
        if (CommonFn.hasProperty(this.data, prop)) {
          this.data[prop] = userTimelineData[prop];
        }
      }
    }
    this.data = DTOGenerator.defineProperty(
      this.data,
      'post',
      {}
    );
    this.data.post = DTOGenerator.genSchemaModel(posts_schema);
    this.data = DTOGenerator.defineProperty(
      this.data,
      'time',
      ''
    );
    this.data = DTOGenerator.defineProperty(
      this.data,
      'comments',
      []
    );
    this.data = DTOGenerator.defineProperty(
      this.data,
      'user',
      {
        id: '',
        user_name: '',
        avatar: ''
      }
    );
    this.data = DTOGenerator.defineProperty(
      this.data,
      'media',
      {
        type: '',
        preview: '',
        embed: ''
      }
    );
    this.data = DTOGenerator.defineProperty(
      this.data,
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

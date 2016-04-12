import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';


const Comments = new Mongo.Collection('comments');

Comments.attachSchema(new SimpleSchema({
  discussionId: {
    type: String,
  },
  parentId: {
    type: String,
    optional: true,
  },
  // used for easy sorting of threaded comments
  fullSlug: {
    type: String,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  author: {
    type: String,
  },
  text: {
    type: String,
  },
}));

export default Comments;

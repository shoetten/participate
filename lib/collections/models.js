import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

const Models = new Mongo.Collection('models');

const MembersSchema = new SimpleSchema({
  userId: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
  },
  joined: {
    type: Date,
    denyUpdate: true,
  },
  contributions: {
    type: Object,
    optional: true,
  },
  'contributions.variables': {
    type: Number,
    defaultValue: 0,
  },
  'contributions.links': {
    type: Number,
    defaultValue: 0,
  },
  'contributions.comments': {
    type: Number,
    defaultValue: 0,
  },
});

Models.attachSchema(new SimpleSchema({
  title: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  slug: {
    type: String,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  modifiedAt: {
    type: Date,
    optional: true,
  },
  permission: {
    type: String,
    allowedValues: ['public', 'private'],
  },
  members: {
    type: [MembersSchema],
    optional: true,
  },
}));

export default Models;

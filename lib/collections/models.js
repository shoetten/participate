import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {find} from 'lodash/fp';

const Models = new Mongo.Collection('models');

const MembersSchema = new SimpleSchema({
  userId: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    defaultValue: false,
  },
  isConfirmed: {
    type: Boolean,
    defaultValue: true,
  },
  joined: {
    type: Date,
  },
  removed: {
    type: Boolean,
    defaultValue: false,
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
  },
}));

Models.before.update((userId, doc, fieldNames, modifier) => {
  modifier.$set = modifier.$set || {};
  modifier.$set.modifiedAt = new Date();
});

Models.helpers({
  hasMember(userId) {
    const member = find({userId}, this.members);
    return member && !member.removed;
  },
  hasRemovedMember(userId) {
    const member = find({userId}, this.members);
    return member && member.removed;
  },
  hasAdmin(userId) {
    const member = find({userId}, this.members);
    return member && !member.removed && member.isAdmin;
  },

  isPublic() {
    return this.permission === 'public';
  },
});

export default Models;

import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

const Links = new Mongo.Collection('links');

Links.attachSchema(new SimpleSchema({
  modelId: {
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
  removed: {
    type: Boolean,
    defaultValue: false,
  },

  fromId: {
    type: String,
  },
  toId: {
    type: String,
  },
  // make object explicit, because the position is not optional
  controlPointPos: {
    type: Object,
  },
  'controlPointPos.x': {
    type: Number,
  },
  'controlPointPos.y': {
    type: Number,
  },
  polarity: {
    type: Number,
    // only allow + and - for now,
    // FCM support might come later
    allowedValues: [-1, 1],
  },
  'votes.up': {
    type: Number,
    min: 0,
    defaultValue: 0,
  },
  'votes.down': {
    type: Number,
    min: 0,
    defaultValue: 0,
  },
}));

Links.before.update((userId, doc, fieldNames, modifier) => {
  modifier.$set = modifier.$set || {};
  modifier.$set.modifiedAt = new Date();
});


export default Links;

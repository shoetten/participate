import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

const Variables = new Mongo.Collection('variables');

Variables.attachSchema(new SimpleSchema({
  name: {
    type: String,
  },
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
  // make object explicit, because the position is not optional
  position: {
    type: Object,
  },
  'position.x': {
    type: Number,
  },
  'position.y': {
    type: Number,
  },
  'votes.up': {
    type: Number,
    min: 0,
  },
  'votes.down': {
    type: Number,
    min: 0,
  },
}));

export default Variables;

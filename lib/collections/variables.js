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
  removed: {
    type: Boolean,
    defaultValue: false,
  },

  // make object explicit, because the position is not optional
  position: {
    type: Object,
  },
  'position.x': {
    type: Number,
    decimal: true,
  },
  'position.y': {
    type: Number,
    decimal: true,
  },

  // store width & height for faster access
  dimensions: {
    type: Object,
  },
  'dimensions.width': {
    type: Number,
  },
  'dimensions.height': {
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

Variables.before.update((userId, doc, fieldNames, modifier) => {
  modifier.$set = modifier.$set || {};
  modifier.$set.modifiedAt = new Date();
});

export default Variables;

import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

const Links = new Mongo.Collection('links');

Links.attachSchema(new SimpleSchema({
  fromId: {
    type: String,
  },
  toId: {
    type: String,
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
  },
  'votes.down': {
    type: Number,
    min: 0,
  },
}));


export default Links;

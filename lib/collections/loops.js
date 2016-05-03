import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

const Loops = new Mongo.Collection('loops');

Loops.attachSchema(new SimpleSchema({
  name: {
    type: String,
  },
  type: {
    type: String,
    allowedValues: ['balancing', 'reinforcing'],
  },
  variableIds: {
    type: [String],
  },
  linkIds: {
    type: [String],
  },
}));

export default Loops;

import {check, Match} from 'meteor/check';
import {isFloat} from '/lib/utils';

export default function ({Meteor, Collections}) {
  const {Variables} = Collections;

  Meteor.methods({
    'variables.create'(_id, name, x, y, width, height, modelId) {
      // On client-side, only check if user is logged in
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(_id, String);
      check(name, String);
      check(x, Match.Where(isFloat));
      check(y, Match.Where(isFloat));
      check(width, Match.Where(isFloat));
      check(height, Match.Where(isFloat));

      const createdAt = new Date();

      const variable = {
        _id,
        name,
        modelId,
        createdAt,
        modifiedAt: createdAt,
        position: {x, y},
        dimensions: {width, height},
      };

      Variables.insert(variable);
    },

    'variables.changeName'(_id, name, modelId) {
      // On client-side, only check if user is logged in
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(_id, String);
      check(name, String);

      Variables.update({_id}, {$set: {name}});
    },

    'variables.changePosition'(_id, x, y, modelId) {
      // On client-side, only check if user is logged in
      check(Meteor.userId(), String);
      // check given data
      check(_id, String);
      check(x, Match.Where(isFloat));
      check(y, Match.Where(isFloat));

      const position = {x, y};

      // Get previous position, so that control points of possible
      // links can be moved, based on the delta
      const prevPos = Variables.findOne(_id).position;
      Meteor.call('links.translateAttached', _id, prevPos, position, modelId);

      Variables.update({_id}, {$set: {position}});
    },

    'variables.changeDimensions'(_id, width, height, modelId) {
      // On client-side, only check if user is logged in
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(_id, String);
      check(width, Match.Where(isFloat));
      check(height, Match.Where(isFloat));

      Variables.update({_id}, {$set: {
        dimensions: {width, height},
      }});
    },


    'variables.remove'(_id, modelId) {
      // On client-side, only check if user is logged in
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(_id, String);

      Variables.update({_id}, {$set: {removed: true}});
    },
  });
}

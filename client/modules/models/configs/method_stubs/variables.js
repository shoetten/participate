// XXX: Create a method stub for new models

import {check, Match} from 'meteor/check';

export default function ({Meteor, Collections}) {
  const {Variables} = Collections;

  Meteor.methods({
    'variables.create'(_id, name, x, y, modelId) {
      // only check if user logged in on client
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(_id, String);
      check(name, String);
      check(x, Match.Where((num) => (
        !isNaN(parseFloat(num)) && isFinite(num)
      )));
      check(y, Match.Where((num) => (
        !isNaN(parseFloat(num)) && isFinite(num)
      )));

      const createdAt = new Date();

      const variable = {
        _id, name,
        modelId,
        createdAt,
        modifiedAt: createdAt,
        position: {x, y},
      };

      Variables.insert(variable);
    },

    'variables.changeName'(id, name, modelId) {
      // only check if user logged in on client
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(id, String);
      check(name, String);

      Variables.update({_id: id}, {$set: {name}});
    },

    'variables.remove'(id, modelId) {
      // only check if user logged in on client
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(id, String);

      Variables.update({_id: id}, {$set: {removed: true}});
    },
  });
}

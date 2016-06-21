// XXX: Create a method stub for new models

import {check, Match} from 'meteor/check';

export default function ({Meteor, Collections}) {
  const {Variables} = Collections;
  Meteor.methods({
    'variables.changeName'(id, name, modelId) {
      // only check if user logged in on client
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(id, String);
      check(name, String);

      Variables.update({_id: id}, {$set: {name}});
    },

    'variables.changePosition'(id, x, y, modelId) {
      // only check if user logged in on client
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(id, String);
      check(x, Match.Where((num) => (
        !isNaN(parseFloat(num)) && isFinite(num)
      )));
      check(y, Match.Where((num) => (
        !isNaN(parseFloat(num)) && isFinite(num)
      )));

      Variables.update({_id: id}, {$set: {
        position: {x, y},
      }});
    },
  });
}

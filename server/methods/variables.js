import {Variables, Models} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {isModelMember, markModelModified} from '../lib/utils';

function checkUserPermissions(userId, modelId) {
  // Is user allowed to edit this model?
  const model = Models.findOne(modelId);
  check(model, Match.Where((m) => (
    isModelMember(userId, m)
  )));
}

export default function () {
  Meteor.methods({
    'variables.create'(_id, name, x, y, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
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

      markModelModified(modelId);
      Variables.insert(variable);
    },

    'variables.changeName'(id, name, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(id, String);
      check(name, String);

      markModelModified(modelId);
      Variables.update({_id: id}, {$set: {name}});
    },

    'variables.changePosition'(id, x, y, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(id, String);
      check(x, Match.Where((num) => (
        !isNaN(parseFloat(num)) && isFinite(num)
      )));
      check(y, Match.Where((num) => (
        !isNaN(parseFloat(num)) && isFinite(num)
      )));

      markModelModified(modelId);
      Variables.update({_id: id}, {$set: {
        position: {x, y},
      }});
    },
  });
}

import {Variables, Models} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {isModelMember, markModelModified} from '../lib/utils';
import {isFloat} from '/lib/utils';

function checkUserPermissions(userId, modelId) {
  // Is user allowed to edit this model?
  const model = Models.findOne(modelId);
  check(model, Match.Where((m) => (
    isModelMember(userId, m)
  )));
}

export default function () {
  Meteor.methods({
    'variables.create'(_id, name, x, y, width, height, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(_id, String);
      check(name, String);
      check(x, Match.Where(isFloat));
      check(y, Match.Where(isFloat));
      check(width, Match.Where(isFloat));
      check(height, Match.Where(isFloat));

      const createdAt = new Date();

      const variable = {
        _id, name,
        modelId,
        createdAt,
        modifiedAt: createdAt,
        position: {x, y},
        dimensions: {width, height},
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

      Variables.update({_id: id}, {$set: {name}});
      markModelModified(modelId);
    },

    'variables.changePosition'(id, x, y, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(id, String);
      check(x, Match.Where(isFloat));
      check(y, Match.Where(isFloat));

      Variables.update({_id: id}, {$set: {
        position: {x, y},
      }});
      markModelModified(modelId);
    },

    'variables.changeDimensions'(id, width, height, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(id, String);
      check(width, Match.Where(isFloat));
      check(height, Match.Where(isFloat));

      Variables.update({_id: id}, {$set: {
        dimensions: {width, height},
      }});
    },

    'variables.remove'(id, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(id, String);

      Variables.update({_id: id}, {$set: {removed: true}});
      markModelModified(modelId);
    },
  });
}

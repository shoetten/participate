import {Variables} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {checkUserPermissions, markModelModified} from '../lib/utils';
import {isFloat} from '/lib/utils';

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

    'variables.changeName'(_id, name, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(_id, String);
      check(name, String);

      Variables.update({_id}, {$set: {name}});
      markModelModified(modelId);
    },

    'variables.changePosition'(_id, x, y, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(_id, String);
      check(x, Match.Where(isFloat));
      check(y, Match.Where(isFloat));

      Variables.update({_id}, {$set: {
        position: {x, y},
      }});
      markModelModified(modelId);
    },

    'variables.changeDimensions'(_id, width, height, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(_id, String);
      check(width, Match.Where(isFloat));
      check(height, Match.Where(isFloat));

      Variables.update({_id}, {$set: {
        dimensions: {width, height},
      }});
    },

    'variables.remove'(_id, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(_id, String);

      Variables.update({_id}, {$set: {removed: true}});
      markModelModified(modelId);
    },
  });
}

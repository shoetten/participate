import {Variables, Models} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {isModelMember} from '../lib/utils';

export default function () {
  Meteor.methods({
    'variables.create'(_id, name, x, y, modelId) {
      check(this.userId, String);

      check(_id, String);
      check(name, String);
      check(x, Number);
      check(y, Number);
      check(modelId, String);
      const model = Models.findOne(modelId);
      check(model, Match.Where((m) => (
        isModelMember(this.userId, m)
      )));

      const createdAt = new Date();

      const variable = {
        _id, name,
        modelId: model._id,
        createdAt,
        modifiedAt: createdAt,
        position: {x, y},
      };

      Variables.insert(variable);
    },

    'variables.changeName'(id, name, modelId) {
      check(this.userId, String);
      check(modelId, String);
      const model = Models.findOne(modelId);
      check(model, Match.Where((m) => (
        isModelMember(this.userId, m)
      )));

      check(id, String);
      check(name, String);

      Variables.insert({
        _id: id,
      }, {
        $set: {name},
      });
    },
  });
}

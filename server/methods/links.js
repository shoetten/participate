import {Links} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {checkUserPermissions, markModelModified} from '../lib/utils';

export default function () {
  Meteor.methods({
    'links.create'(_id, fromId, toId, polarity, controlPointX, controlPointY, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(_id, String);
      check(fromId, String);
      check(toId, String);
      check(polarity, Number);
      check(controlPointX, Number);
      check(controlPointY, Number);

      const createdAt = new Date();

      const link = {
        _id, modelId,
        createdAt, modifiedAt: createdAt,
        fromId, toId,
        controlPointPos: {x: controlPointX, y: controlPointY},
        polarity,
      };

      markModelModified(modelId);
      Links.insert(link);
    },

    'links.changeControlPosition'(_id, x, y, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(_id, String);
      check(x, Number);
      check(y, Number);

      Links.update({_id}, {$set: {
        controlPointPos: {x, y},
      }});
      markModelModified(modelId);
    },

    'links.remove'(_id, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(_id, String);

      Links.update({_id}, {$set: {removed: true}});
      markModelModified(modelId);
    },
  });
}

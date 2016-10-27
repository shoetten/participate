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
        _id,
        modelId,
        createdAt,
        modifiedAt: createdAt,
        fromId,
        toId,
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

    'links.changePolarity'(_id, polarity, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(_id, String);
      check(polarity, Number);

      Links.update({_id}, {$set: {polarity}});
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

    // Used to remove all attached links, when a variable
    // is deleted.
    'links.removeAttached'(varId, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(varId, String);

      const selector = {
        $or: [
          { fromId: varId },
          { toId: varId },
        ],
      };

      Links.update(selector, {$set: {removed: true}}, {multi: true});
    },

    'links.translateAttached'(varId, prevPos, nextPos, modelId) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId);
      // check given data
      check(varId, String);
      check(prevPos, {x: Number, y: Number});
      check(nextPos, {x: Number, y: Number});

      const deltaX = Math.round(nextPos.x - prevPos.x);
      const deltaY = Math.round(nextPos.y - prevPos.y);

      const selector = {
        $or: [
          { fromId: varId },
          { toId: varId },
        ],
      };

      Links.update(selector, {$inc: {
        'controlPointPos.x': deltaX,
        'controlPointPos.y': deltaY,
      }}, {multi: true});
    },
  });
}

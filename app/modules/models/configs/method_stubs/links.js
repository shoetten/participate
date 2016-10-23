import {check} from 'meteor/check';

export default function ({Meteor, Collections}) {
  const {Links} = Collections;

  Meteor.methods({
    'links.create'(_id, fromId, toId, polarity, controlPointX, controlPointY, modelId) {
      // Don't check anything on client, to gain some performance.
      // This is safe, because the real checks are done server-side anyway

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

      Links.insert(link);
    },

    'links.changePolarity'(_id, polarity, modelId) {
      // On client-side, only check if user is logged in
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(_id, String);
      check(polarity, Number);

      Links.update({_id}, {$set: {polarity}});
    },

    'links.remove'(_id, modelId) {
      // On client-side, only check if user is logged in
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(_id, String);

      Links.update({_id}, {$set: {removed: true}});
    },

    // Used to remove all attached links, when a variable
    // is deleted.
    'links.removeAttached'(varId, modelId) {
      // On client-side, only check if user is logged in
      check(Meteor.userId(), String);
      check(modelId, String);
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

    'links.translateAttached'(varId, deltaX, deltaY, modelId) {
      // On client-side, only check if user is logged in
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(varId, String);
      check(deltaX, Number);
      check(deltaY, Number);

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
